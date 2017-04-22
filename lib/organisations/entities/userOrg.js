var Joi = require('joi');
module.exports = function () {
  var seneca = this;
  var name = 'userOrg';
  var domain = 'cd';
  var base = 'user_org';

  var definition = {
    id: Joi.string(),
    userId: Joi.string(),
    orgId: Joi.string()
  };

  return {
    name: name,
    domain: domain,
    definition: definition,
    acts: {
      get: {
        validation: {id: definition.id.required()},
        cb: function (args, cb) {
          var orm = seneca.make$(domain, base);
          orm.load$(args.id, cb);
        }
      },
      search: {
        validation: {query: Joi.object().required()},
        cb: function (args, cb) {
          var orm = seneca.make$(domain, base);
          orm.list$(args.query, cb);
        }
      },
      searchExtended: {
        validation: {query: Joi.object().required()},
        cb: function (args, cb) {
          var orm = seneca.make$(domain, 'v_' + base);
          orm.list$(args.query, cb);
        }
      },
      save: {
        validation: {
          userOrg: Joi.object().keys({
            userId: definition.userId.required(),
            orgId: definition.orgId.required()
          }).required()
        },
        cb: function (args, cb) {
          var orm = seneca.make$(domain, base);
          orm.save$(args.userOrg, cb);
        }
      },
      delete: {
        validation: {id: Joi.string()},
        cb: function (args, cb) {
          var orm = seneca.make$(domain, base);
          orm.remove$(args.query, cb);
        }
      }
    }
  };
};
