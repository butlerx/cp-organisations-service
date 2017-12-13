const _ = require('lodash');
const path = require('path');
const config = require('./config/config.js')();
const cpLogs = require('cp-logs-lib');
const cpPerm = require('cp-permissions-plugin');
const seneca = require('seneca');
const senecaEntity = require('seneca-entity');
const senecaBasic = require('seneca-basic');
const senecaJoi = require('seneca-joi');

module.exports = (configOverride) => {
  const log = cpLogs({ name: 'cp-organisations', level: 'warn' });
  config.log = log.log;
  const server = seneca(_.extend(config, configOverride));
  server
    .use(senecaEntity)
    .use(senecaBasic)
    .use(senecaJoi)
    .use('./cd-organisations', {})
    .use(cpPerm, {
      config: path.resolve(`${__dirname}/lib/organisations/controllers/perm`),
    })
    .use('seneca-amqp-transport')
    .listen({
      type: 'amqp',
      pin: 'cmd:*',
      hostname: process.env.RABBIT_HOST || 'transport',
      user: process.env.RABBIT_USER || 'guest',
      password: process.env.RABBIT_PASS || 'guest',
    });
  return server;
};
