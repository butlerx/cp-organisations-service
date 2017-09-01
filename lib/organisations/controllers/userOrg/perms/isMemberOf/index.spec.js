exports.lab = require('lab').script();

const lab = exports.lab;
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const fn = require('./index');

chai.use(sinonChai);
const expect = chai.expect;

lab.experiment('perm/isMemberOf', () => {
  let isMemberOf;
  let sandbox;
  let senecaStub;
  lab.beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub(),
    };
    isMemberOf = fn().bind(senecaStub);
    done();
  });

  lab.afterEach((done) => {
    sandbox.restore();
    done();
  });

  lab.test('should allow only member of the passed organisation', (done) => {
    // ARRANGE
    const payload = { user: { id: 1 }, params: { orgId: 2 } };
    const profileListMock = {
      id: 'x',
      userId: payload.user.id,
      orgId: payload.orgId,
      orgName: 'banana',
      username: 'John',
    };
    senecaStub.act
      .withArgs({
        role: 'cd-organisations',
        entity: 'userOrg',
        cmd: 'list',
        query: { orgId: payload.params.orgId, userId: payload.user.id },
      })
      .callsFake((args, cb) => {
        cb(null, [profileListMock]);
      });
    // ACT
    isMemberOf(payload, (err, { allowed }) => {
      expect(err).to.not.exist;
      expect(senecaStub.act).to.have.been.calledOnce;
      expect(allowed).to.be.true;
      done();
    });
  });

  lab.test('should refuse member of the passed organisation', (done) => {
    // ARRANGE
    const payload = { user: { id: 1 }, params: { orgId: 2 } };

    senecaStub.act
      .withArgs({
        role: 'cd-organisations',
        entity: 'userOrg',
        cmd: 'list',
        query: { orgId: payload.params.orgId, userId: payload.user.id },
      })
      .callsFake((args, cb) => {
        cb(null, []);
      });
    // ACT
    isMemberOf(payload, (err, { allowed }) => {
      expect(err).to.not.exist;
      expect(senecaStub.act).to.have.been.calledOnce;
      expect(allowed).to.be.false;
      done();
    });
  });
});
