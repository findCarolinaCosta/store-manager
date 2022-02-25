const Sales = require('../models/sales');

const getAll = async () => Sales.getAll();

const findById = async (id) => Sales.findById(id);

const create = async (sales) => {
  const { insertId: saleId } = await Sales.create();
  await sales.forEach(async ({ productId, quantity }) => {
    await Sales.createSalesProduct({ saleId, productId, quantity });
  });
  const returnObj = {
    id: saleId,
    itemsSold: sales,
  };
  return returnObj;
};

const update = async ({ sales, id: saleId }) => {
  await sales.forEach(async ({ productId, quantity }) => {
    await Sales.update({ saleId, productId, quantity });
  });
  const returnObj = {
    saleId,
    itemUpdated: sales,
  };
  return returnObj;
};

const destroy = async (id) => {
  const findSale = await Sales.findById(id);

  if (!findSale) {
    return false;
  }
  await Sales.destroy(id);
  return true;
};

module.exports = {
  getAll,
  findById,
  create,
  update,
  destroy,
};