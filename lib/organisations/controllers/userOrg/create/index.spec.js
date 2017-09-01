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

lab.experiment('userOrg/create', () => {
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
        save: sandbox.stub().callsFake(({ userOrg }) =>
          Promise.resolve({
            id: 42,
            userId: userOrg.userId,
            orgId: userOrg.orgId,
          }),
        ),
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

  lab.test('should call save and return the saved org/user relationship', (done) => {
    // ARRANGE
    const payload = { userOrg: { userId: 1, orgId: 2 }, ctrl: 'userOrg' };
    // ACT
    createOrg(payload, (err, { id, userId, orgId }) => {
      expect(err).to.not.exist;
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.userOrg.save).to.have.been.calledWith(omit(payload, 'ctrl'));
      expect(id).to.equal(42);
      expect(userId).to.equal(payload.userOrg.userId);
      expect(orgId).to.equal(payload.userOrg.orgId);
      done();
    });
  });
});
