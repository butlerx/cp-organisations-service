const _ = require('lodash');
const { promisify } = require('bluebird');
const orgEntity = require('./lib/organisations/entities/org');
const userOrgEntity = require('./lib/organisations/entities/userOrg');
const orgController = require('./lib/organisations/controllers/org/index');
const userOrgController = require('./lib/organisations/controllers/userOrg/index');
//  Utils
const pingCmd = require('./lib/ping');

function cdOrganisations() {
  // https://github.com/senecajs/seneca/issues/112
  const seneca = this.root;
  const org = orgEntity.bind(seneca)();
  const userOrg = userOrgEntity.bind(seneca)();
  const acts = {};
  const plugin = 'cd-organisations';
  const senecaActP = promisify(seneca.act, { context: seneca });

  function keyCb(entityName, key) {
    return args =>
      senecaActP(
        _.extend(
          {
            role: plugin,
            entity: entityName,
            cmd: key,
          },
          args,
        ),
      );
  }

  // Load primitives
  [org, userOrg].forEach((entity) => {
    acts[entity.name] = {};
    Object.entries(entity.acts).forEach(([key, { validation, cb }]) => {
      const act = _.extend(
        {
          role: plugin,
          entity: entity.name,
          cmd: key,
        },
        validation,
      );
      seneca.add(act, cb);
      // Add a promise shortcut for controllers
      acts[entity.name][key] = keyCb(entity.name, key);
      seneca.log.debug(`added act role:${entity.name} cmd:${key}`);
    });
  });

  // Load controllers
  const ctrls = {};
  ctrls.org = orgController.bind(seneca)();
  ctrls.userOrg = userOrgController.bind(seneca)();
  _.each(ctrls, (ctrl, entity) => {
    Object.entries(ctrl.acts).forEach(([key, { validation, cb }]) => {
      const act = _.extend(
        {
          role: plugin,
          ctrl: entity,
          cmd: key,
        },
        validation,
      );
      seneca.add(act, cb);
      seneca.log.info('added act', act, { joi$: validation });
      // No promise are added, we shouldn't have to reuse the same function twice.
      // If we do, create an utility
    });
  });

  // Load utilities
  seneca.add({ role: plugin, cmd: 'ping' }, pingCmd);

  return {
    name: plugin,
    exportmap: {
      acts,
    },
  };
}

module.exports = cdOrganisations;
