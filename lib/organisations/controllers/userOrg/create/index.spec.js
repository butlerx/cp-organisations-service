'use strict';

var lab = exports.lab = require('lab').script();
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');
var Promise = require('bluebird');
var omit = require('lodash').omit;
var fn = require('./index');

lab.experiment('userOrg/create', function () {
  var createOrg, sandbox, senecaStub, exportMock;
  lab.beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub(),
      export: sandbox.stub()
    };
    exportMock = {
      'userOrg': {
        save: sandbox.stub().callsFake(function (args) {
          return Promise.resolve({
            id: 42,
            userId: args.userOrg.userId,
            orgId: args.userOrg.orgId
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

  lab.test('should call save and return the saved org/user relationship', function (done) {
    // ARRANGE
    var payload = {userOrg: {userId: 1, orgId: 2}, ctrl: 'userOrg'};
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledOnce;
      expect(exportMock.userOrg.save).to.have.been.calledWith(omit(payload, 'ctrl')).once;
      expect(val.id).to.equal(42);
      expect(val.userId).to.equal(payload.userOrg.userId);
      expect(val.orgId).to.equal(payload.userOrg.orgId);
      done();
    });
  });
});
