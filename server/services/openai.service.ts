import { OpenAI } from 'openai';

import { config } from '../config/envs';
import { logger } from '../config/logger';
import { catchError } from '../utils/promises';

class OpenAIService {
  private readonly _openai: OpenAI;

  constructor() {
    this._openai = new OpenAI({ apiKey: config.openaiApiKey });
  }

  async classyfyText(text: string, categories: string[]): Promise<string> {
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
}

export const openAIService = new OpenAIService();
