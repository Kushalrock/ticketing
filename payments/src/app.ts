import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession  from 'cookie-session';
import { currentUser, errorHandler } from '@agrkushal-test/commontixis';
import { NotFoundError } from '@agrkushal-test/commontixis';
import { createChargeRouter } from './routes/new';
const app = express();
app.enable('trust proxy');
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);


app.use(createChargeRouter);
app.all('*', async() => {throw new NotFoundError()});

app.use(errorHandler);

export {app};