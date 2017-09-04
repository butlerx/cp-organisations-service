const Joi = require('joi');
const isMemberOfVal = require('./perms/isMemberOf/validation');
const isMemberOf = require('./perms/isMemberOf');
const listVal = require('./list/validation');
const list = require('./list');
const createVal = require('./create/validation');
const create = require('./create');
const deleteVal = require('./delete/validation');
const deleteFn = require('./delete');

module.exports = function userOrg() {
  const seneca = this;
  const name = 'userOrg';
  const domain = 'cd-organisations';
  const plugin = 'cd-userOrg';
  seneca.context = {};

  const definition = {
    id: Joi.string(),
    userId: Joi.string(),
    orgId: Joi.string(),
  };

  return {
    name,
    plugin,
    domain,
    definition,
    acts: {
      isMemberOf: {
        validation: isMemberOfVal(definition),
        cb: isMemberOf.bind(this)(),
      },
      list: {
        validation: { joi$: listVal(definition) },
        cb: list.bind(this)(),
      },
      create: {
        validation: createVal(definition),
        cb: create.bind(this)(),
      },
      delete: {
        validation: deleteVal(definition),
        cb: deleteFn.bind(this)(),
      },
    },
  };
};
