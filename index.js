/* eslint-disable no-console */
const service = 'cp-organisations-service';
const store = require('seneca-postgres-store');
const util = require('util');
const dgram = require('dgram');
const config = require('./config/config.js')();
const seneca = require('./imports')(config);
const network = require('./network');

if (process.env.NEW_RELIC_ENABLED === 'true') require('newrelic'); // eslint-disable-line global-require

seneca.use(store, config['postgresql-store']);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', shutdown);
process.on('SIGUSR2', shutdown);

function shutdown(err) {
  if (err !== undefined) {
    const error = {
      date: new Date().toString(),
      msg:
        err.stack !== undefined
          ? `FATAL: UncaughtException, please report: ${util.inspect(err.stack)}`
          : 'FATAL: UncaughtException, no stack trace',
      err: util.inspect(err),
    };
    console.error(JSON.stringify(error));
    process.exit(1);
  }
  process.exit(0);
}

require('./database/pg/migrate-psql-db.js')((err) => {
  if (err) {
    console.log(`Migrations Nok for ${service}`);
    console.error(err);
    process.exit(-1);
  }
  console.log(`Migrations ok for ${service}`);
  network(seneca);
});

seneca.ready(() => {
  const message = new Buffer(service);

  const client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, 11404, 'localhost', (err) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    client.close();
  });
});
