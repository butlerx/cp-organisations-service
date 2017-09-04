const postgrator = require('postgrator');
const config = require('./../../config/config.js')();

module.exports = function migrate(cb) {
  postgrator.setConfig({
    migrationDirectory: './database/pg/migrations',
    driver: 'pg',
    host: config['postgresql-store'].host,
    schemaTable: 'org_schemaversion',
    database: config['postgresql-store'].name,
    username: config['postgresql-store'].username,
    password: config['postgresql-store'].password,
    newline: 'LF',
  });
  postgrator.runQuery(
    'CREATE SCHEMA IF NOT EXISTS "cp_organisations_schema";SET search_path TO "cp_organisations_schema";',
    (err) => {
      if (err) return cb(err);
      postgrator.migrate('max', (err, migrations) => {
        postgrator.endConnection(() => cb(err, migrations));
      });
    },
  );
};
