import { OpenAI } from 'openai';

import { config } from '../config/envs';
import { logger } from '../config/logger';
import { catchError } from '../utils/promises';
import type {
  CategoryForService,
  IDocumentHandler,
} from '../types/document-handle';
import { toDataUrl } from '../utils/to-base64';

class OpenAIService implements IDocumentHandler {
  private readonly _openai: OpenAI;
  private readonly PROMP = [
    'Actúa como un clasificador estricto de documentos.',
    'Debes elegir exactamente una categoría de la lista proporcionada.',
    'Devuelve SOLO un JSON válido con la forma: {"folderName":"<valor>"}',
    'Si no coincide ninguna, usa {"folderName":"Otros"}',
    'Lista de categorías (usa el campo folderName exactamente):',
  ];

  constructor() {
    this._openai = new OpenAI({ apiKey: config.openaiApiKey });
  }

  async classifyText(
    text: string,
    categories: string[]
  ): Promise<string> {
    const categoriesAsString = categories.join(', ');
    const prompt = `Clasifica el siguiente texto en una categoría: ${categoriesAsString}. Devuélveme solo la categoría.

        Texto: """${text}"""`;

    const [response, error] = await catchError(
      this._openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      })
    );

    if (error) {
      logger.error('Error al clasificar el texto:', error);
      throw new Error('Error al clasificar el texto');
    }

    return response?.choices[0]?.message?.content?.trim() || 'Otro';
  }

  async classifyImage(
    file: Express.Multer.File,
    categories: CategoryForService[]
  ): Promise<CategoryForService> {
    const base64Img = toDataUrl(file);
    const [resp, error] = await catchError(
      this._openai.responses.create({
        model: 'gpt-5-mini-2025-08-07',
        instructions:
          'Eres un clasificador de documentos. Responde solo con la categoría.',
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: this.buildPrompt(categories) },
              {
                type: 'input_image',
                image_url: base64Img,
                detail: 'auto' as const,
              },
            ],
          },
        ],
      })
    );

    if (error) {
      logger.error('Error al clasificar la imagen:', error);
      throw new Error('Error al clasificar la imagen');
    }

    const text = resp?.output_text.trim() || 'Otro';
    let folderName = '';
    try {
      const parsed = JSON.parse(text) as { folderName: string };
      folderName = (parsed.folderName || '').trim();
    } catch {
      folderName = text.replace(/(^"|"$)/g, '').trim();
    }
    const norm = (s: string) =>
      s
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
    const byFolder =
      categories.find((c) => norm(c.folderName) === norm(folderName)) ??
      categories.find((c) => norm(c.name) === norm(folderName));

    const result =
      byFolder ?? categories.find((c) => norm(c.folderName) === norm('Otros'));
    if (!result) {
      throw new Error(
        `No se encontró categoría para la respuesta del modelo: "${folderName}"`
      );
    }

    return result;
  }

  async classifyPDF(
    file: Express.Multer.File,
    categories: CategoryForService[]
  ): Promise<CategoryForService> {
    return {
      folderName: 'PDF',
      id: categories[0].id,
      name: categories[0].name,
    };
  }

  private buildPrompt(categories: CategoryForService[]): string {
    const list = categories
      .map((c) => `- ${c.folderName} (alias: ${c.name})`)
      .join('\n');
    return this.PROMP.join(' ') + ' Categorías: ' + list;
  }
}

export const openAIService = new OpenAIService();
