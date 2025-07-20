import express from 'express';

import { config } from '../config/envs';
import { logger } from '../config/logger';
import apiRouter from '../routes/api.route';

const app = express();
app.use(express.json());

export const main = async () => {
  app.get('/ping', (_, res) => {
    res.json({ pong: 'pong' });
  });

  // Use routes
  app.use('/api', apiRouter);

  // Start the server
  app.listen(config.port, () => {
    logger.info(`Server is running on http://localhost:${config.port}`);
  });
};

main();
