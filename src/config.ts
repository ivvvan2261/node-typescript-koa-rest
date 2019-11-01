import dotenv from 'dotenv';

dotenv.config({ path: '.example.env' });

export interface IConfig {
    port: number;
    debugLogging: boolean;
    dbsslconn: boolean;
    jwtSecret: string;
    databaseUrl: string;
    cronJobExpression: string;
}

const isDevMode = process.env.NODE_ENV == 'development';

const config: IConfig = {
    port: +process.env.PORT || 3000,
    debugLogging: isDevMode,
    dbsslconn: !isDevMode,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-whatever',
    databaseUrl: process.env.DATABASE_URL || 'mongodb://user:pass@localhost:27017/apidb',
    cronJobExpression: '0 * * * *'
};

export { config };