const seneca = require('../imports')({ log: { level: 'info' } });
require('../network')(seneca);
const _ = require('lodash');
const flat = require('flat');

const service = 'cd-organisations';
// ENTITIES
const entities = {};
entities.userOrg = require('../lib/organisations/entities/userOrg.js').bind(seneca)();
entities.org = require('../lib/organisations/entities/org.js').bind(seneca)();
// CTRLS
const ctrls = {};
ctrls.userOrg = require('../lib/organisations/controllers/userOrg/index.js').bind(seneca)();
// ctrls['org'] = require('../lib/organisations/controllers/org/index.js').bind(seneca)();

const async = require('async');
const _lab = require('lab');

const lab = exports.lab = _lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = require('code').expect;

describe('cp-organisations-service-controller', () => {
  const testedEnt = {};
  lab.before((done) => {
    seneca.ready(() => {
      done();
    });
  });

  it('should register entity acts', (done) => {
    const acts = seneca.list();
    const expected_acts = [];
    _.each(entities, (entity) => {
      _.each(entity.acts, (def, act) => {
        expected_acts.push({ role: service, entity: entity.name, cmd: act });
      });
    });
    seneca.log.info('1/', acts.length - _.pullAllWith(_.clone(acts), expected_acts, _.isEqual).length, expected_acts.length);
    expect(acts.length - _.pullAllWith(_.clone(acts), expected_acts, _.isEqual).length).to.be.equal(expected_acts.length);
    expect(expected_acts.length).to.be.above(1);
    done();
  });

  it('should register controllers acts', (done) => {
    // TODO : extend to other controllers
    async.eachSeries(ctrls, (ctl, cbS) => {
      async.eachOfSeries(ctl.acts, (fixt, key, cbOS) => {
        const cmd = { role: service, ctrl: ctl.name, cmd: key };
        const exists = seneca.has(cmd);
        seneca.log.info('2/ cmd:', cmd, ' exists', exists, typeof exists);
        expect(exists).to.be.true();
        cbOS();
      }, cbS);
    }, done);
  });

  // Explicit perms to avoid forgetting adding some
  it('should have as many perms as there is acts', (done) => {
    const perms = flat(require('../lib/organisations/controllers/perm')(), { maxDepth: 3 });
    const ctrlActs = _.filter(seneca.list(), o => _.has(o, 'ctrl'));
    // This extra check will only be doable once we do https://github.com/CoderDojo/cp-permissions-plugin/issues/8
    // var acts = _.filter(seneca.list(), {cmd: 'check_permissions'});
    // expect(_.keys(perms).length).to.be.equal(acts.length);
    expect(_.keys(perms).length).to.be.equal(ctrlActs.length);
    done();
  });

  // // VALIDATION
  // No need to validate them all, we just want to verify the bootloader (/lib/index)
  it('should validate entities acts with joi', (done) => {
    seneca.act({ role: 'cd-organisations', entity: 'org', cmd: 'get'}, (err, app) => {
      expect(err.code).to.be.equal('act_invalid_msg');
      done();
    });
  });
  //
  it('should validate entities acts while promised with joi', (done) => {
    const app = seneca.export('cd-organisations/acts').org;
    app.get({ org: undefined})
      .catch((err) => {
        expect(err.code).to.be.equal('act_invalid_msg');
        done();
      });
  });
  //
  it('should validate controllers acts with joi', (done) => {
    seneca.act({ role: 'cd-organisations', ctrl: 'userOrg', cmd: 'create', userOrg: {} }, (err, app) => {
      expect(err.code).to.be.equal('act_invalid_msg');
      done();
    });
  });
});
