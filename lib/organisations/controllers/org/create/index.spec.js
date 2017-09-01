exports.lab = require('lab').script();

const lab = exports.lab;
const chai = require('chai');
const sinonChai = require('sinon-chai');
const Promise = require('bluebird'); // eslint-disable-line no-shadow
const sinon = require('sinon');
const fn = require('./index');

chai.use(sinonChai);
const expect = chai.expect;

lab.experiment('org/create', () => {
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
      org: {
        save: sandbox.stub().callsFake(({ org }) =>
          Promise.resolve({
            id: 42,
            name: org.name,
            createdAt: org.createdAt,
            createdBy: org.createdBy,
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

  lab.test('should call save and return the saved org', (done) => {
    // ARRANGE
    const payload = { org: { name: 'Rito' }, user: { id: 1 }, ctrl: 'org' };
    // ACT
    createOrg(payload, (err, { id, name }) => {
      expect(err).to.not.exist;
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.org.save).to.have.been.calledOnce;
      expect(id).to.equal(42);
      expect(name).to.equal(payload.org.name);
      done();
    });
  });
  lab.test('should set default value for creation date/user', (done) => {
    // ARRANGE
    const payload = { org: { name: 'Rito' }, user: { id: 1 }, ctrl: 'org' };
    // ACT
    createOrg(payload, (err, { createdAt, createdBy }) => {
      expect(err).to.not.exist;
      expect(createdAt).to.exist;
      expect(createdBy).to.equal(1);
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.org.save).to.have.been.calledOnce;
      done();
    });
  });
});
