var Joi = require('joi');

module.exports = function () {
  var seneca = this;
  var name = 'org';
  var domain = 'cd-organisations';
  var plugin = 'cd-organisations';
  seneca.context = {};

  var definition = {
    name: Joi.string()
  };

  return {
    name: name,
    plugin: plugin,
    domain: domain,
    definition: definition,
    acts: {
      create: {
        validation: require('./create/validation')(definition),
        cb: require('./create').bind(this)()
      },
      load: {
        validation: require('./load/validation')(definition),
        cb: require('./load').bind(this)()
      },
      list: {
        validation: require('./list/validation')(definition),
        cb: require('./list').bind(this)()
      }
    }
  };
};
