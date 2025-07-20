import express from 'express';

import { config } from '../config/envs';
import { logger } from '../config/logger';

const app = express()
app.use(express.json());

export const main = async () => {
    // Use routes
    // app.use('/api', routes.default);
    
    // Start the server
    app.listen(config.port, () => {
        logger.info(`Server is running on http://localhost:${config.port}`);
    });
};

main();