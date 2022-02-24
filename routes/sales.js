const express = require('express');

const Router = express.Router();
const Sales = require('../controllers/sales');
const middlewares = require('../middlewares');

Router.get('/', Sales.getAll);

Router.get('/:id', Sales.findById);

Router.post('/', middlewares.validateSale);

Router.put('/', middlewares.validateSale);

module.exports = Router;