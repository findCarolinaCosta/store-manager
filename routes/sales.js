const express = require('express');

const Router = express.Router();
const Sales = require('../controllers/sales');
const middlewares = require('../middlewares');

Router
  .route('/')
  .get(Sales.getAll)
  .post(middlewares.validateSale, Sales.create);

Router.get('/:id', Sales.findById);

Router
  .route('/:id')
  .put(middlewares.validateSale, Sales.update)
  .delete(Sales.destroy);

module.exports = Router;