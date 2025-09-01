import Tesseract from 'tesseract.js';

import { logger } from '../config/logger';
import type { CategoryForService, IDocumentHandler } from '../types/document-handle';
import { catchError } from '../utils/promises';

class OCRService implements IDocumentHandler {
  classifyText(text: string, categories: string[]): Promise<string> {
    throw new Error('Method not implemented.');
  }
  classifyImage(
    file: Express.Multer.File,
    categories: CategoryForService[]
  ): Promise<CategoryForService> {
    throw new Error('Method not implemented.');
  }

  classifyPDF(
    file: Express.Multer.File,
    categories: CategoryForService[]
  ): Promise<CategoryForService> {
    throw new Error('Method not implemented.');
  }

  async extractTextFromImage(imagePath: string): Promise<string> {
    const [data, error] = await catchError(
      Tesseract.recognize(imagePath, 'spa', {
        logger: (m) => console.log(m),
      })
    );

    if (error) {
      logger.error('Error al extraer texto de la imagen:', error);
      throw new Error('Error al procesar la imagen');
    }

    return data?.data.text || 'No se encontró texto';
  }
}

export const ocrService = new OCRService();
