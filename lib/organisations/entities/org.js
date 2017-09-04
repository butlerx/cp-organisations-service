const Joi = require('joi');

module.exports = function orgEnt() {
  const seneca = this;
  const name = 'org';
  const domain = 'cp_organisations_schema.cd';
  const base = 'organisations';

  const definition = {
    id: Joi.string(),
    createdBy: Joi.string(),
    name: Joi.string(),
  };

  return {
    name,
    domain,
    definition,
    acts: {
      get: {
        validation: { id: definition.id.required() },
        cb({ id }, cb) {
          const orm = seneca.make$(domain, base);
          orm.load$(id, cb);
        },
      },
      search: {
        validation: { query: Joi.object().required() },
        cb({ query }, cb) {
          const orm = seneca.make$(domain, base);
          orm.list$(query, cb);
        },
      },
      save: {
        validation: { org: Joi.object().required() },
        cb({ org }, cb) {
          const orm = seneca.make$(domain, base);
          orm.save$(org, cb);
        },
      },
      delete: {
        validation: { id: Joi.string() },
        cb({ id }, cb) {
          const orm = seneca.make$(domain, base);
          orm.remove$(id, cb);
        },
      },
    },
  };
};
