const Products = require('../services/products');

const getAll = async (_req, res, next) => {
  try {
    const products = await Products.getAll('author');

    if (!products) {
      const error = { status: 500, message: 'Internal server error' };
      throw error;
    }
    
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);

    if (!id) {
      const error = { status: 400, message: 'Bad Request' };
      throw error;
    }

    if (!product) {
      const error = { status: 404, message: 'Product not found' };
      throw error;
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;

    const product = await Products.create({ name, quantity });

    if (!product) {
      const err = { status: 409, message: 'Product already exists' };
      throw err;
    }
    
    return res.status(201).json(product);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const product = await Products.update({ id, name, quantity });

    if (!product) {
      const err = { status: 404, message: 'Product not found' };
      throw err;
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Products.destroy(id);
  
    if (!product) {
      const err = { status: 404, message: 'Product not found' };
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