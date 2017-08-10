'use strict';

var lab = exports.lab = require('lab').script();
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');
var Promise = require('bluebird');
var omit = require('lodash').omit;
var fn = require('./index');

lab.experiment('userOrg/delete', function () {
  var createOrg, sandbox, senecaStub, exportMock;
  lab.beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub(),
      export: sandbox.stub()
    };
    exportMock = {
      'userOrg': {
        delete: sandbox.stub().returns(Promise.resolve())
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

  lab.test('should call delete', function (done) {
    // ARRANGE
    var payload = {userId: 1, orgId: 2, ctrl: 'userOrg'};
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.userOrg.delete).to.have.been.calledWith({query: omit(payload, 'ctrl')}).once;
      done();
    });
  });
});
