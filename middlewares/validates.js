const productsSchema = require('../schemas/productsSchema');
const salesSchema = require('../schemas/salesSchema');

 const validateProduct = (req, _res, next) => {  
   try {
   const { error } = productsSchema.validate(req.body);
   
   if (error) {
      const [code, message] = error.message.split('|');
      const err = { status: code, message };
      throw err;
   }

   return next();
   } catch (error) {
     next(error);
   }
};

const validateSale = (req, _res, next) => {
  try {
    const { error } = salesSchema.validate(req.body);

  if (error) {
    const [code, message] = error.message.split('|');
    const err = { status: code, message };
    throw err;
  }
  return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateProduct,
  validateSale,
};