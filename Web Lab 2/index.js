import express from 'express';
import bodyParser from 'body-parser';
import { OrdersRouter } from './routers/index.js';
import { UsersRouter } from './routers/index.js';

const app = express();

app.use(bodyParser.json());

app.use(UsersRouter);
app.use(OrdersRouter);

/**
 * POST -- create resource
 * req -> input data
 * res -> output data
 */


app.listen(8080, () => console.log('Server was started'));

