const Joi = require('joi');
const { pick } = require('lodash');

module.exports = definition => ({
  userOrg: Joi.object().keys(pick(definition, ['userId', 'orgId'])),
});
