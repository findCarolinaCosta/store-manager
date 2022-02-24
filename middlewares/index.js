const { validateProduct, validateSale } = require('./validates');
module.exports.errorHandle = require('./errorHandle');

module.exports.validateProduct = validateProduct;
module.exports.validateSale = validateSale;