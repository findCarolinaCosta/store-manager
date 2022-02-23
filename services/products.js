const Products = require('../models/products');

const getAll = async () => Products.getAll();

const findById = async (id) => Products.findById(id);

module.exports = {
  getAll,
  findById,
};