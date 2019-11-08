import Config from 'config';

export interface IConfig {
    port: number;
    loglevel: string;
    dbsslconn: boolean;
    jwtSecret: string;
    databaseUrl: string;
    cronJobExpression: string;
}

const isDevMode = process.env.NODE_ENV == 'development';

const config: IConfig = {
    port: Config.get('ports.http') || 3000,
    loglevel: Config.get('loglevel'),
    dbsslconn: !isDevMode,
    jwtSecret: Config.get('auth.jwt_secret').toString() || 'your-secret-whatever',
    databaseUrl: Config.get('mongo.url').toString() || 'mongodb://user:pass@localhost:27017/apidb',
    cronJobExpression: '0 * * * *'
};

export { config };