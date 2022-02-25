const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT * FROM products;';
  const [result] = await connection.execute(query);

  if (result.length === 0) return null;

  return result;
};

const findById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = ?;';
  const [result] = await connection.execute(query, [id]);

  if (result.length === 0) return null;

  return result[0];
};

const create = async ({ name, quantity }) => {
  const query = 'INSERT INTO StoreManager.products (name, quantity) VALUES (?, ?);';
  const [result] = await connection.execute(query, [name, quantity]);
  return result;
};

const update = async ({ id, name, quantity }) => {
  const query = 'UPDATE StoreManager.products SET name = ?, quantity = ? WHERE id = ?;';
  const [result] = await connection.execute(query, [name, quantity, id]);
  return result;
};

module.exports = {
  getAll,
  findById,
  create,
  update,
};