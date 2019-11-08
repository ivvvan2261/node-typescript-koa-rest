import app from './app';
import { config } from './config/config';
import logger from './util/logger';

const port = config.port;
const loglevel = config.loglevel;

// Start Webserver
const server = app.listen(port, () => {
    logger.info(`
    ------------
    Server Started!
    App is running in ${app.env} mode
    Logging initialized at ${loglevel} level

    Http: http://localhost:${port}
    Health: http://localhost:${port}/ping

    API Docs: http://localhost:${port}/swagger-html
    API Spec: http://localhost:${port}/swagger-json
    ------------
    `);
});

export default server;