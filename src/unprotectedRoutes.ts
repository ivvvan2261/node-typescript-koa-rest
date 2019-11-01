import Router from 'koa-router';
import controller = require('./controllers');

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get('/', controller.general.helloWorld);

export { unprotectedRouter };