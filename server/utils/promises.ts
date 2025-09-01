import { logger } from '../config/logger';

export const catchError = async <T>(
  promise: Promise<T>
): Promise<[T | null, any]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    console.error({ error });
    logger.error('Error in promise:', error);
    return [null, error];
  }
};
