const express = require('express');

const Router = express.Router();
const Products = require('../controllers/products');
const middlewares = require('../middlewares');

Router
  .route('/')
  .get(Products.getAll)
  .post(middlewares.validateProduct, Products.create);

Router
  .route('/:id')
  .get(Products.findById)
  .delete(Products.destroy);

Router.put('/:id', middlewares.validateProduct, Products.update);

module.exports = Router;