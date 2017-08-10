'use strict';

var lab = exports.lab = require('lab').script();
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');
var Promise = require('bluebird');
var fn = require('./index');

lab.experiment('org/list', function () {
  var listOrg, sandbox, senecaStub, exportMock;
  lab.beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub(),
      export: sandbox.stub()
    };
    exportMock = {
      'org': {
        search: sandbox.stub().returns(Promise.resolve())
      }
    };
    senecaStub.export.withArgs('cd-organisations/acts').returns(exportMock);
    listOrg = fn().bind(senecaStub);
    done();
  });

  lab.afterEach(function (done) {
    sandbox.restore();
    done();
  });

  lab.test('should call search', function (done) {
    // ARRANGE
    var payload = {ctrl: 'org'};
    // ACT
    listOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.org.search).to.have.been.calledWith({query: {}}).once;
      done();
    });
  });
});
