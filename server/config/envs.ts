import { env } from 'process';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { PORT, DATABASE_URL } = env;

export const config = {
  port: PORT ? parseInt(PORT, 10) : 3000,
  databaseUrl:
    DATABASE_URL || 'postgres://postgres:postgres@db:5432/document_classifier',
};
