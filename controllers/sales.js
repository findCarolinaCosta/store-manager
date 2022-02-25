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
  const sale = await Sales.create(req.body);
  return res.status(201).json(sale);
};

const update = async (req, res) => {
  const { id } = req.params;
  const sales = req.body;
  const salesResult = await Sales.update({ sales, id });
  return res.status(200).json(salesResult);
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Sales.destroy(id);
  
    if (!product) {
      const err = { status: 404, message: 'Sale not found' };
        throw err;
    }
  
    return res.status(204).end();
  } catch (error) {
    console.log('catch-log:', error);
    next(error);
  }
};

module.exports = {
  getAll,
  findById,
  create,
  update,
  destroy,
};