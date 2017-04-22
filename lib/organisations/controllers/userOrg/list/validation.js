var Joi = require('joi');
module.exports = function (definition) {
  return {orgId: Joi.string().required()};
};
