import { env } from 'process';

import dotenv from 'dotenv';
import z from 'zod';

import { logger } from './logger';

// Load environment variables from .env file
if (env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env' });
}

const EnvSchema = z.object({
  DATABASE_URL: z
    .url()
    .default('postgres://postgres:postgres@db:5432/document_classifier'),
  PORT: z.coerce.number().min(1).default(3000),
  OPENAI_API_KEY: z
    .string()
    .default('your_openai_api_key_here'),
  PROVIDER: z.enum(['openai', 'tesseract']).default('openai'),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.log({ ...parsed.error.format() });
  logger.error('Invalid environment variables', z.treeifyError(parsed.error));
  process.exit(1);
}

const { PORT, DATABASE_URL, OPENAI_API_KEY, PROVIDER } = parsed.data;

export const config = {
  port: PORT,
  databaseUrl: DATABASE_URL,
  openaiApiKey: OPENAI_API_KEY,
  provider: PROVIDER,
};
