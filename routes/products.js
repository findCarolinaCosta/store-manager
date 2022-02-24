const express = require('express');

const Router = express.Router();
const Products = require('../controllers/products');
const middlewares = require('../middlewares');

Router.get('/', Products.getAll);

Router.get('/:id', Products.findById);

Router.post('/', middlewares.validateProduct);

Router.put('/', middlewares.validateProduct);

module.exports = Router;