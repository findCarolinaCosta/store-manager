const Sales = require('../services/sales');

const getAll = async (_req, res, next) => {
  try {
    const sales = await Sales.getAll();

    if (!sales) {
      const error = { status: 500, message: 'Internal server error' };
      throw error; 
    }

    return res.status(200).json(sales);
  } catch (error) {
    console.log(error);
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
    console.log(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const sale = await Sales.create(req.body);

  if (!sale) {
    const error = { status: 422, message: 'Such amount is not permitted to sell' };
  throw error;
  }

  return res.status(201).json(sale);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
  const sales = req.body;
  const salesResult = await Sales.update({ sales, id });

  if (!salesResult) {
    const err = { status: 404, message: 'Sale not found' };
      throw err;
  }

  return res.status(200).json(salesResult);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salesResult = await Sales.destroy(id);
  
    if (!salesResult) {
      const err = { status: 404, message: 'Sale not found' };
        throw err;
    }
  
    return res.status(204).end();
  } catch (error) {
    console.log(error);
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