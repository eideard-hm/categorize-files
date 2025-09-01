import type { Request, Response } from 'express';

import { config } from '../config/envs';
import { ocrService } from '../services/ocr.service';
import { openAIService } from '../services/openai.service';
import type { IDocumentHandler } from '../types/document-handle';
import { catchError } from '../utils/promises';
import { categoryService } from '../services/category.service';

class DocumentController {
  private readonly provider: IDocumentHandler;

  constructor() {
    this.provider = config.provider === 'openai' ? openAIService : ocrService;
  }

  handleUpload = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const isImgFile = file.mimetype.startsWith('image/');
    if (isImgFile) {
      const [categories] = await catchError(
        categoryService.retrieveCategories()
      );
      console.log({ categories });

      const [category, error] = await catchError(
        this.provider.classifyImage(
          file,
          (categories || []).map((cat) => ({
            id: cat.id,
            name: cat.name,
            folderName: cat.folderName,
          }))
        )
      );
      if (error) {
        return res.status(500).send('Error classifying image.');
      }

      return res.status(200).json({ category });
    }

    // Process the uploaded file
    res.status(200).send('File uploaded successfully.');
  };

  handleClassification(req: Request, res: Response) {
    // Handle document classification
  }
}

export const documentController = new DocumentController();
