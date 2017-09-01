const Joi = require('joi');
const create = require('./create');
const createVal = require('./create/validation');
const load = require('./load');
const loadVal = require('./load/validation');
const list = require('./list');
const listVal = require('./list/validation');

module.exports = function org() {
  const seneca = this;
  const name = 'org';
  const domain = 'cd-organisations';
  const plugin = 'cd-organisations';
  seneca.context = {};

  const definition = {
    name: Joi.string(),
  };

  return {
    name,
    plugin,
    domain,
    definition,
    acts: {
      create: {
        validation: createVal(definition),
        cb: create.bind(this)(),
      },
      load: {
        validation: loadVal(definition),
        cb: load.bind(this)(),
      },
      list: {
        validation: listVal(definition),
        cb: list.bind(this)(),
      },
    },
  };
};
