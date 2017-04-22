var Joi = require('joi');
var pick = require('lodash').pick;
module.exports = function (definition) {
  return {userOrg: Joi.object().keys(pick(definition, ['userId', 'orgId']))};
};
