import Tesseract from 'tesseract.js';

import { logger } from '../config/logger';
import { catchError } from '../utils/promises';

class OCRService {
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
