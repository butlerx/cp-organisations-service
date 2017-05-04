var Joi = require('joi');
var pick = require('lodash').pick;
module.exports = function (definition) {
  var list = ['orgId', 'userId'];
  return Joi.object().keys(pick(definition, list)).or(list);
};
