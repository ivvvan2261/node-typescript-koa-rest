import Router from 'koa-router';
import { SwaggerRouter } from 'koa-swagger-decorator';
import generalController from './controllers/general.ctrl';

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get('/', generalController.helloWorld);

const protectedRouter = new SwaggerRouter();

// Swagger endpoint
protectedRouter.swagger({
    title: 'node-typescript-koa-starter',
    description: 'API REST using NodeJS and KOA framework, typescript, class-validators. Middlewares JWT, CORS, MongoDB database, Winston Logger.',
    version: '1.5.0'
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname);

export { unprotectedRouter, protectedRouter };