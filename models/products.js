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

module.exports = {
  getAll,
  findById,
};