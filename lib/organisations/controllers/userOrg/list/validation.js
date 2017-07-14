var Joi = require('joi');
var pick = require('lodash').pick;
module.exports = function (definition) {
  var list = ['orgId', 'userId', 'query'];
  return Joi.object().keys(pick(definition, list)).or(list);
};
