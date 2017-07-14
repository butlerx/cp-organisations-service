var Joi = require('joi');
module.exports = function () {
  var seneca = this;
  var name = 'org';
  var domain = 'cp_organisations_schema.cd';
  var base = 'organisations';

  var definition = {
    id: Joi.string(),
    createdBy: Joi.string(),
    name: Joi.string()
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
      save: {
        validation: {org: Joi.object().required()},
        cb: function (args, cb) {
          var orm = seneca.make$(domain, base);
          orm.save$(args.org, cb);
        }
      },
      delete: {
        validation: {id: Joi.string()},
        cb: function (args, cb) {
          var orm = seneca.make$(domain, base);
          orm.remove$(args.id, cb);
        }
      }
    }
  };
};
