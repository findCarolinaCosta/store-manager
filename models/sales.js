const connection = require('./connection');

const serialize = (data) => ({
    saleId: data.sale_id,
    productId: data.product_id,
    quantity: data.quantity,
    date: data.date,
  });

const getAll = async () => {
  const query = `SELECT sp.sale_id, sp.product_id, sp.quantity, s.date
FROM StoreManager.sales_products AS sp INNER JOIN StoreManager.sales AS s ON sp.sale_id = s.id;`;
  const [result] = await connection.execute(query);

  return result.map(serialize);
};

const findById = async (id) => {
  const query = `SELECT sp.product_id, sp.quantity, s.date FROM sales_products AS sp 
  INNER JOIN StoreManager.sales AS s ON sp.sale_id = s.id WHERE sp.sale_id = ?;`;
  const [result] = await connection.execute(query, [id]);

  if (result.length === 0) return null;

  return result.map(serialize);
};

const create = async () => {
  const query = 'INSERT INTO StoreManager.sales (`date`) VALUES (NOW());';
  const [result] = await connection.execute(query);
  return result;
};

const createProduct = async ({ saleId, productId, quantity }) => {
  const query = `INSERT INTO StoreManager.sales_products 
  (sale_id, product_id, quantity) VALUES (?, ?, ?);`;
  await connection.execute(query, [saleId, productId, quantity]);
};

module.exports = {
  getAll,
  findById,
  create,
  createProduct,
};