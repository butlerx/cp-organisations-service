var Joi = require('joi');
var pick = require('lodash').pick;
module.exports = function (definition) {
  return {org: Joi.object().keys(pick(definition, ['name']))};
};
