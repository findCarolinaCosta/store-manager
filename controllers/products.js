const Products = require('../services/products');

const getAll = async (_req, res, next) => {
  try {
    const products = await Products.getAll('author');
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);

    if (!product) {
      const error = { status: 404, message: 'Product not found' };
      throw error;
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  findById,
};