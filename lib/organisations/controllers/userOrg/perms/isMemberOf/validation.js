const { pick } = require('lodash');
const Joi = require('joi');

module.exports = definition => ({
  user: Joi.object().required(),
  params: Joi.object().keys(pick(definition, ['userId', 'orgId'])).required(),
});
