const productsSchema = require('../schemas/productsSchema');
const salesSchema = require('../schemas/salesSchema');

 const validateProduct = (req, _res, next) => {
  const { error } = productsSchema.validate(req.body);
  
  if (error) {
    const [code, message] = error.message.split('|');
    const err = { status: code, message };
    return next(err);
  }
  return next();
};

const validateSale = (req, _res, next) => {
  const { error } = salesSchema.validate(req.body);

  if (error) {
    const [code, message] = error.message.split('|');
    const err = { status: code, message };
    return next(err);
  }
  return next();
};

module.exports = {
  validateProduct,
  validateSale,
};