var Joi = require('joi');
var pick = require('lodash').pick;
module.exports = function (definition) {
  return pick(definition, ['userId', 'orgId']);
};
