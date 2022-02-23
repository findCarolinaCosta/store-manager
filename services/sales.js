const Sales = require('../models/sales');

const getAll = async () => Sales.getAll();

const findById = async (id) => Sales.findById(id);

module.exports = {
  getAll,
  findById,
};