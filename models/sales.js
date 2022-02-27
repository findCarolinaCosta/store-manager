const connection = require('./connection');

const updateProduct = async ({ productId, quantity }) => {
  const query = 'UPDATE StoreManager.products SET quantity = ? WHERE id = ?;';
  const [result] = await connection.execute(query, [quantity, productId]);
  return result;
};

const findByProductId = async (id) => {
  const query = 'SELECT * FROM StoreManager.products WHERE id = ?;';
  const [result] = await connection.execute(query, [id]);

  if (result.length === 0) return null;

  return result;
};

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
  const query = `SELECT sp.product_id, sp.quantity, s.date FROM StoreManager.sales_products AS sp 
  INNER JOIN StoreManager.sales AS s ON sp.sale_id = s.id WHERE sp.sale_id = ?;`;
  const [result] = await connection.execute(query, [id]);

  if (result.length === 0) return null;

  return result.map((data) => ({
    productId: data.product_id,
    quantity: data.quantity,
    date: data.date,
  }));
};

const create = async () => {
  const query = 'INSERT INTO StoreManager.sales (`date`) VALUES (NOW());';
  const [result] = await connection.execute(query);
  return result;
};

const createSalesProduct = async ({ saleId, productId, quantity }) => {
  const queryProduct = 'SELECT * FROM StoreManager.products WHERE id = ?;';
  const [product] = await connection.execute(queryProduct, [productId]);
  const newQuantity = product[0].quantity - quantity;
  await updateProduct({ productId, quantity: newQuantity });

  const query = `INSERT INTO StoreManager.sales_products 
  (sale_id, product_id, quantity) VALUES (?, ?, ?);`;
  const [result] = await connection.execute(query, [saleId, productId, quantity]);
  return result;
};

const update = async ({ saleId, productId, quantity }) => {
  const query = `UPDATE StoreManager.sales_products SET quantity = ? 
  WHERE sale_id = ? AND product_id = ?;`;
  const [result] = await connection.execute(query, [quantity, saleId, productId]);
  return result;
};

const destroy = async (id) => {
  const queryProductId = 'SELECT product_id FROM StoreManager.sales_products WHERE sale_id = ?;';
  const queryProduct = 'SELECT * FROM StoreManager.products WHERE id = ?;';
  const query = 'DELETE FROM StoreManager.sales_products WHERE sale_id = ?;';

  const [productId] = await connection.execute(queryProductId, [id]);
  const [product] = await connection.execute(queryProduct, [productId[0].product_id]);
  const sale = await findById(id);

  const newQuantity = product[0].quantity + sale[0].quantity;

  await updateProduct({ productId: productId[0].product_id, quantity: newQuantity });
  const [result] = await connection.execute(query, [id]);
  return result;
};

module.exports = {
  getAll,
  findById,
  create,
  createSalesProduct,
  update,
  destroy,
  updateProduct,
  findByProductId,
};