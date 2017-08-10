'use strict';

var lab = exports.lab = require('lab').script();
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');
var Promise = require('bluebird');
var fn = require('./index');

lab.experiment('org/create', function () {
  var createOrg, sandbox, senecaStub, exportMock;
  lab.beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub(),
      export: sandbox.stub()
    };
    exportMock = {
      'org': {
        save: sandbox.stub().callsFake(function (args) {
          return Promise.resolve({
            id: 42,
            name: args.org.name,
            createdAt: args.org.createdAt,
            createdBy: args.org.createdBy
          });
        })
      }
    };
    senecaStub.export.withArgs('cd-organisations/acts').returns(exportMock);
    createOrg = fn().bind(senecaStub);
    done();
  });

  lab.afterEach(function (done) {
    sandbox.restore();
    done();
  });

  lab.test('should call save and return the saved org', function (done) {
    // ARRANGE
    var payload = {org: {name: 'Rito'}, user: {id: 1}, ctrl: 'org'};
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.org.save).to.have.been.calledOnce;
      expect(val.id).to.equal(42);
      expect(val.name).to.equal(payload.org.name);
      done();
    });
  });
  lab.test('should set default value for creation date/user', function (done) {
    // ARRANGE
    var payload = {org: {name: 'Rito'}, user: {id: 1}, ctrl: 'org'};
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(val.createdAt).to.exist;
      expect(val.createdBy).to.equal(1);
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.org.save).to.have.been.calledOnce;
      done();
    });
  });
});
