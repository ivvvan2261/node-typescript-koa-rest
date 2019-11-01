import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import winston from 'winston';
import 'reflect-metadata';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

import { logger } from './logging';
import { config } from './config';
import { unprotectedRouter } from './unprotectedRoutes';
import { protectedRouter } from './protectedRoutes';
import { cron } from './cron';

// Connect to MongoDB
const mongoUrl = config.databaseUrl;
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(async () => {

    const app = new Koa();

    // Provides important security headers to make your app more secure
    app.use(helmet());

    // Enable cors with default options
    app.use(cors());

    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logger(winston));

    // Enable bodyParser with default options
    app.use(bodyParser());

    // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));

    // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // Register cron job to do any action needed
    cron.start();

    app.listen(config.port, () => {
        console.log(
            '  App is running at http://localhost:%d in %s mode',
            config.port,
            app.env
        );
        console.log('  Swagger-ui is available on http://localhost:%d/swagger-html', config.port);
        console.log('  Press CTRL-C to stop\n');
    });

}).catch(error => console.log('MongoDB connection error: ', error));