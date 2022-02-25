const Sales = require('../services/sales');

const getAll = async (_req, res, next) => {
  try {
    const sales = await Sales.getAll('author');
    return res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findById(id);

    if (!sale) {
      const error = { status: 404, message: 'Sale not found' };
      throw error;
    }

    return res.status(200).json(sale);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res) => {
  const product = await Sales.create(req.body);
  return res.status(201).json(product);
};

module.exports = {
  getAll,
  findById,
  create,
};