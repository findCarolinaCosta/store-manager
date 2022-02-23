const express = require('express');

const Router = express.Router();
const Products = require('../controllers/products');

Router.get('/', Products.getAll);

Router.get('/:id', Products.findById);

module.exports = Router;