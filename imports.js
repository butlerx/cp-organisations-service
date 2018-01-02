const _ = require('lodash');
const path = require('path');
const config = require('./config/config.js')();
const cpPerm = require('cp-permissions-plugin');
const seneca = require('seneca');
const senecaEntity = require('seneca-entity');
const senecaBasic = require('seneca-basic');
const senecaJoi = require('seneca-joi');

module.exports = (configOverride) => {
  const server = seneca(_.extend(config, configOverride));
  server.use(senecaEntity).use(senecaBasic).use(senecaJoi);
  server.use('./cd-organisations', {});
  server.use(cpPerm, {
    config: path.resolve(`${__dirname}/lib/organisations/controllers/perm`),
  });
  return server;
};
