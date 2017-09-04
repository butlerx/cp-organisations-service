exports.lab = require('lab').script();

const lab = exports.lab;
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const Promise = require('bluebird'); // eslint-disable-line no-shadow
const { omit } = require('lodash');
const fn = require('./index');

chai.use(sinonChai);
const expect = chai.expect;

lab.experiment('userOrg/list', () => {
  let createOrg;
  let sandbox;
  let senecaStub;
  let exportMock;
  lab.beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub(),
      export: sandbox.stub(),
    };
    exportMock = {
      userOrg: {
        search: sandbox.stub().returns(Promise.resolve([{ id: 1, userId: 1, orgId: 2 }])),
      },
      org: {
        search: sandbox.stub().returns(Promise.resolve([{ id: 2, name: 'E' }])),
      },
    };
    senecaStub.export.withArgs('cd-organisations/acts').returns(exportMock);
    createOrg = fn().bind(senecaStub);
    done();
  });

  lab.afterEach((done) => {
    sandbox.restore();
    done();
  });

  lab.test('should call list with userId & orgId', (done) => {
    // ARRANGE
    const payload = { userId: 1, orgId: 2, ctrl: 'userOrg' };
    const profileListMock = {
      id: 'x',
      userId: payload.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user',
    };
    senecaStub.act
      .withArgs({ role: 'cd-profiles', cmd: 'list', query: { userId: { in$: [payload.userId] } } })
      .callsFake((args, cb) => {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, (err) => {
      expect(err).to.not.exist;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({
        query: omit(payload, 'ctrl'),
      });
      expect(exportMock.org.search).to.have.been.calledWith({ query: { id: { in$: [2] } } });
      done();
    });
  });

  lab.test('should call list with query', (done) => {
    // ARRANGE
    const payload = { query: { userId: 1, orgId: 2 }, ctrl: 'userOrg' };
    const profileListMock = {
      id: 'x',
      userId: payload.query.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user',
    };
    senecaStub.act
      .withArgs({
        role: 'cd-profiles',
        cmd: 'list',
        query: { userId: { in$: [payload.query.userId] } },
      })
      .callsFake((args, cb) => {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, (err) => {
      expect(err).to.not.exist;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({ query: payload.query });
      expect(exportMock.org.search).to.have.been.calledWith({ query: { id: { in$: [2] } } });
      done();
    });
  });
  lab.test('should combine params to call list with query', (done) => {
    // ARRANGE
    const payload = { userId: 1, query: { orgId: 2 }, ctrl: 'userOrg' };
    const profileListMock = {
      id: 'x',
      userId: payload.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user',
    };
    senecaStub.act
      .withArgs({ role: 'cd-profiles', cmd: 'list', query: { userId: { in$: [payload.userId] } } })
      .callsFake((args, cb) => {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, (err) => {
      expect(err).to.not.exist;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({
        query: { userId: payload.userId, orgId: payload.query.orgId },
      });
      expect(exportMock.org.search).to.have.been.calledWith({ query: { id: { in$: [2] } } });
      done();
    });
  });
  lab.test('should extend the user info', (done) => {
    // ARRANGE
    const payload = { query: { userId: 1, orgId: 2 }, ctrl: 'userOrg' };
    const profileListMock = {
      id: 'x',
      userId: payload.query.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user',
    };
    senecaStub.act
      .withArgs({
        role: 'cd-profiles',
        cmd: 'list',
        query: { userId: { in$: [payload.query.userId] } },
      })
      .callsFake((args, cb) => {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, (err, val) => {
      expect(err).to.not.exist;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({ query: payload.query });
      expect(exportMock.org.search).to.have.been.calledWith({ query: { id: { in$: [2] } } });
      expect(val).to.be.an('array');
      expect(val[0].username).to.be.equal(profileListMock.name);
      expect(val[0].email).to.be.equal(profileListMock.email);
      expect(val[0].userType).to.be.equal(profileListMock.userType);
      expect(val[0].orgName).to.be.equal('E');
      expect(val[0].userId).to.be.equal(profileListMock.userId);
      expect(val[0].orgId).to.be.equal(2);
      done();
    });
  });
});
