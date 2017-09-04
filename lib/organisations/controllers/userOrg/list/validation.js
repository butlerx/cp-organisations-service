const Joi = require('joi');
const { pick } = require('lodash');

module.exports = (definition) => {
  const list = ['orgId', 'userId', 'query'];
  return Joi.object().keys(pick(definition, list)).or(list);
};
