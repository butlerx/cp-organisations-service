var Joi = require('joi');

module.exports = function () {
  var seneca = this;
  var name = 'userOrg';
  var domain = 'cd-organisations';
  var plugin = 'cd-userOrg';
  seneca.context = {};

  var definition = {
    id: Joi.string(),
    userId: Joi.string(),
    orgId: Joi.string()
  };

  return {
    name: name,
    plugin: plugin,
    domain: domain,
    definition: definition,
    acts: {
      isMemberOf: {
        validation: require('./perms/isMemberOf/validation')(definition),
        cb: require('./perms/isMemberOf').bind(this)()
      },
      list: {
        validation: {joi$: require('./list/validation')(definition)},
        cb: require('./list').bind(this)()
      },
      create: {
        validation: require('./create/validation')(definition),
        cb: require('./create').bind(this)()
      },
      delete: {
        validation: require('./delete/validation')(definition),
        cb: require('./delete').bind(this)()
      }
    }
  };
};
