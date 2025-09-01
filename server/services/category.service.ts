import type { Category } from '../src/generated/prisma';
import { prisma } from '../utils/prisma';
import { catchError } from '../utils/promises';

class CategoryService {
  async retrieveCategories(): Promise<Category[]> {
    const [categories, error] = await catchError<Category[]>(
      prisma.category.findMany()
    );
    if (error || !categories) {
      throw new Error('Error retrieving categories');
    }
    return categories;
  }
}

export const categoryService = new CategoryService();
