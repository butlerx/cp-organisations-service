'use strict';

module.exports = function (seneca) {
  seneca.listen()
    .client({
      type: 'web',
      host: process.env.CD_USERS || 'localhost',
      port: 10303,
      pin: {
        role: 'cd-profiles',
        cmd: '*'
      }
    });
};
