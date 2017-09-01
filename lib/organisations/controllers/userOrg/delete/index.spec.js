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

lab.experiment('userOrg/delete', () => {
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
        delete: sandbox.stub().returns(Promise.resolve()),
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

  lab.test('should call delete', (done) => {
    // ARRANGE
    const payload = { userId: 1, orgId: 2, ctrl: 'userOrg' };
    // ACT
    createOrg(payload, (err) => {
      expect(err).to.not.exist;
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.userOrg.delete).to.have.been.calledWith({
        query: omit(payload, 'ctrl'),
      });
      done();
    });
  });
});
