import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads/items', express.static( path.resolve(__dirname, '..', 'uploads', 'items') ));
app.use('/uploads/points', express.static( path.resolve(__dirname, '..', 'uploads', 'points') ));

app.use(errors());

app.listen(3333);