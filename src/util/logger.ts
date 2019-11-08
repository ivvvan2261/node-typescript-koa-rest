import winston from 'winston';
import { config } from '../config/config';

const options: winston.LoggerOptions = {
    level: config.loglevel,
    transports: [
        // - Write all logs error (and below) to `error.log`.
        new winston.transports.File({ filename: 'error.log', level: 'error' }),

        // - Write to all logs with specified level to console.
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
};

const logger = winston.createLogger(options);

export default logger;
