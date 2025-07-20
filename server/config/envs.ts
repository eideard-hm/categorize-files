import { env } from 'process';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { PORT, DATABASE_URL, OPENAI_API_KEY } = env;

export const config = {
  port: PORT ? parseInt(PORT, 10) : 3000,
  databaseUrl:
    DATABASE_URL || 'postgres://postgres:postgres@db:5432/document_classifier',
  openaiApiKey: OPENAI_API_KEY || 'your_openai_api_key_here',
};
