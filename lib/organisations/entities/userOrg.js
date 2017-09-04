const Joi = require('joi');

module.exports = function userOrgEnt() {
  const seneca = this;
  const name = 'userOrg';
  const domain = 'cp_organisations_schema.cd';
  const base = 'user_org';

  const definition = {
    id: Joi.string(),
    userId: Joi.string(),
    orgId: Joi.string(),
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
        validation: {
          userOrg: Joi.object()
            .keys({
              userId: definition.userId.required(),
              orgId: definition.orgId.required(),
            })
            .required(),
        },
        cb({ userOrg }, cb) {
          const orm = seneca.make$(domain, base);
          orm.save$(userOrg, cb);
        },
      },
      delete: {
        validation: { id: Joi.string() },
        cb({ query }, cb) {
          const orm = seneca.make$(domain, base);
          orm.remove$(query, cb);
        },
      },
    },
  };
};
