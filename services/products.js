const Products = require('../models/products');

const getAll = async () => Products.getAll();

const findById = async (id) => Products.findById(id);

const create = async ({ name, quantity }) => {
  const allProducts = await Products.getAll();
  const isExisting = allProducts.some(({ name: prodName }) => prodName === name);
  if (isExisting) {
    return null;
  }

  const product = await Products.create({ name, quantity });
  const productCreated = {
    id: product.insertId,
    name,
    quantity,
  };
  return productCreated;
};

module.exports = {
  getAll,
  findById,
  create,
};