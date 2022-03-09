const Sales = require('../models/sales');

const getAll = async () => Sales.getAll();

const findById = async (id) => Sales.findById(id);

const create = async (sales) => {
  const { insertId: saleId } = await Sales.create();
  
  const createList = await Promise.all(sales.map(async ({ productId, quantity }) => {
    const [product] = await Sales.findByProductId(productId);
    
    if (product.quantity <= quantity) return true;

    await Sales.createSalesProduct({ saleId, productId, quantity });
  }));

  const checkItems = createList.some((product) => product);

  if (checkItems) return null;

  const returnObj = {
    id: saleId,
    itemsSold: sales,
  };

  return returnObj;
};

const update = async ({ sales, id: saleId }) => {
  const sale = await findById(saleId);

  if (!sale) return null;

  await Promise.all(sales.map(async ({ productId, quantity }) => {
    await Sales.update({ saleId, productId, quantity });
  }));

  const returnObj = {
    saleId,
    itemUpdated: sales,
  };

  return returnObj;
};

const destroy = async (id) => {
  const findSale = await Sales.findById(id);
  
  if (!findSale) return null;
  
  const result = await Sales.destroy(id);
  return result;
};

module.exports = {
  getAll,
  findById,
  create,
  update,
  destroy,
};