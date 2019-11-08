import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import 'reflect-metadata';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

import { setupLogging } from './config/logging';
import { config } from './config/config';
import { unprotectedRouter, protectedRouter } from './routes';
import { cron } from './tasks/cron';
import { CustomError } from './util/customError';

// Create Koa server
const app = new Koa();

// Connect to MongoDB
const mongoUrl = config.databaseUrl;
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    // process.exit();
});

// Logger middleware -> use winston as logger (logging.ts with config)
setupLogging(app);

// Provides important security headers to make your app more secure
app.use(helmet());

// Enable cors with default options
app.use(cors());

// Enable bodyParser with default options
app.use(bodyParser());

// Error handling
app.use(async (ctx, next) => {
    return next().catch((err) => {
        if (!(err instanceof CustomError)) {
            err = new CustomError('unexpected error', err.message);
        }
        ctx.status = 500;
        ctx.body = { success: false, error: err.toJSON() };
    });
});

// Format response data
app.use(async (ctx, next) => {
    await next();
    if (!ctx.path.match(/^\/swagger-/) && !ctx.path.match(/^\/favicon.ico/)) {
        ctx.body = { success: true, data: ctx.body };
    }
});

// these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

// JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
// do not protect swagger-json and swagger-html endpoints
app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/, /^\/favicon.ico/] }));

// These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

// Register cron job to do any action needed
cron.start();

export default app;