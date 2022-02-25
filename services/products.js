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

const update = async ({ id, name, quantity }) => {
  const allProducts = await Products.getAll();
  const isExistingProduct = allProducts.some(({ id: prodId }) => Number(prodId) === Number(id));
  if (!isExistingProduct) {
    return null;
  }
  const { affectedRows } = await Products.update({ id, name, quantity });

  const editedProduct = {
    id,
    name,
    quantity,
  };
  return (affectedRows === 1 ? editedProduct : null);
};

const destroy = async (id) => {
  const isExistingProduct = await Products.findById(id);

  if (!isExistingProduct) {
    return false;
  }
  await Products.destroy(id);
  return true;
};

module.exports = {
  getAll,
  findById,
  create,
  update,
  destroy,
};