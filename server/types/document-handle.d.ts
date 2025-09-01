import type { Category } from '../src/generated/prisma';

export interface IDocumentHandler {
  classifyText(text: string, categories: string[]): Promise<string>;

  classifyImage(
    file: Express.Multer.File,
    categories: CategoryForService[]
  ): Promise<CategoryForService>;

  classifyPDF(
    file: Express.Multer.File,
    categories: CategoryForService[]
  ): Promise<CategoryForService>;
}

export type CategoryForService = Pick<Category, 'id' | 'name' | 'folderName'>;
