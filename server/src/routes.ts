import express from 'express';
import upload from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import createValidator from './validation/PointRules';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();


routes.get('/teste', () => {
    return 'teste';
});

routes.get('/items', itemsController.index);

routes.post(
    '/points', 
    upload.single('image'), 
    createValidator,
    pointsController.create
);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;
