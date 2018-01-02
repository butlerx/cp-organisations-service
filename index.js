const service = 'cp-organisations-service';
const store = require('seneca-postgres-store');
const util = require('util');
const dgram = require('dgram');
const { log, logger } = require('cp-logs-lib')({
  name: 'cp-organisations',
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
});
const config = require('./config/config.js')({ log });
const seneca = require('./imports')(config);
const network = require('./network');

logger.info(config, 'config');
seneca.use(store, config['postgresql-store']);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', shutdown);
process.on('SIGUSR2', shutdown);

function shutdown(err) {
  if (err !== undefined) {
    logger.error(
      err,
      err.stack !== undefined
        ? `FATAL: UncaughtException, please report: ${util.inspect(err.stack)}`
        : 'FATAL: UncaughtException, no stack trace',
    );
    process.exit(1);
  }
  process.exit(0);
}

require('./database/pg/migrate-psql-db.js')((err) => {
  if (err) {
    logger.info(`Migrations Nok for ${service}`);
    shutdown(err);
  }
  logger.info(`Migrations ok for ${service}`);
  network(seneca);
});

seneca.ready(() => {
  const message = new Buffer(service);

  const client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, 11404, 'localhost', (err) => {
    if (err) shutdown(err);
    client.close();
  });
});
