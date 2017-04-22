var pick = require('lodash').pick;
var Joi = require('joi');
module.exports = function (definition) {
  return {
    user: Joi.object().required(),
    params: Joi.object().keys(pick(definition, ['userId', 'orgId'])).required()
  };
};
