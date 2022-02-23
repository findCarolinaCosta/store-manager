const connection = require('./connection');

const serialize = (data) => ({
    saleId: data.sale_id,
    productId: data.product_id,
    quantity: data.quantity,
    date: data.date,
  });

const getAll = async () => {
  const query = `SELECT sale_id, product_id, quantity, date
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

module.exports = {
  getAll,
  findById,
};