import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

// Items
routes.get('/items', ItemsController.all);

// Points
routes.post('/points', PointsController.create);
routes.get('/points', PointsController.all);
routes.get('/points/:id', PointsController.show);

export default routes;
