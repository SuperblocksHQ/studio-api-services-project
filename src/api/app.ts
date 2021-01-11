import * as express from 'express';
require('express-async-errors'); // hack to make express handle exceptions in async functions
import { MongoError } from 'mongodb';
import { connectToDB } from 'infrastructure-mongodb';
import * as compression from 'compression';
import * as cors from 'cors';
import { oEmbedRouter, projectsRouter, healthCheckRouter } from './routers';
import { initTokenAuth } from './middleware';
import { globalErrorHandler } from './global-error-handler';

const app = express();

// middlewares
app.use(compression());
app.use(cors({
    origin: process.env.ORIGIN
}));
app.use(express.json({ limit: '50mb' }));
app.use(initTokenAuth());

// routes
const apiPrefix = '/v1';
app.use(apiPrefix, healthCheckRouter);
app.use(apiPrefix, projectsRouter);
app.use(oEmbedRouter);

// error handler
app.use(globalErrorHandler);

connectToDB().then(
    () => {
        const port = parseInt(process.env.PORT, 10) || 80;
        console.log('Successfully connected to database');
        app.listen(port, () => console.log(`Project services API is listening on port ${port}`));
    },
    (err: MongoError) => {
        console.error('Unable to start project services API. Could not connect to database:', err);
        process.exit(1);
    }
);
