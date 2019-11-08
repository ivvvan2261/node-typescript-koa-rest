import Koa from 'koa';
import logger from '../util/logger';

export function setupLogging(app: any) {
    app.use(koaLogging());
}

function koaLogging() {
    return async (ctx: Koa.Context, next: () => Promise<any>) => {

        const start = new Date().getTime();

        await next();

        const ms = new Date().getTime() - start;

        let logLevel: string;
        if (ctx.status >= 500) {
            logLevel = 'error';
        } else if (ctx.status >= 400) {
            logLevel = 'warn';
        } else if (ctx.status >= 100) {
            logLevel = 'info';
        }

        const msg: string = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

        logger.log(logLevel, msg);
    };
}
