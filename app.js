import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import jokesRouter from './routes/jokes';
import notificationsRouter from './routes/notifications';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/jokes', jokesRouter);
app.use('/notifications', notificationsRouter);

export default app;
