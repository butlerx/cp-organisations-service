const Joi = require('joi');
const { pick } = require('lodash');

module.exports = definition => ({
  org: Joi.object().keys(pick(definition, ['name'])),
});
