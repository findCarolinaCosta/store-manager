const express = require('express');

const Router = express.Router();
const Sales = require('../controllers/sales');

Router.get('/', Sales.getAll);

Router.get('/:id', Sales.findById);

module.exports = Router;