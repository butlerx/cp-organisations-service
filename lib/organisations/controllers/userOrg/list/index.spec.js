'use strict';

var lab = exports.lab = require('lab').script();
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');
var Promise = require('bluebird');
var omit = require('lodash').omit;
var fn = require('./index');

lab.experiment('userOrg/list', function () {
  var createOrg, sandbox, senecaStub, exportMock;
  lab.beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub(),
      export: sandbox.stub()
    };
    exportMock = {
      'userOrg': {
        search: sandbox.stub().returns(Promise.resolve([
          {id: 1, userId: 1, orgId: 2}
        ]))
      },
      'org': {
        search: sandbox.stub().returns(Promise.resolve([{id: 2, name: 'E'}]))
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

  lab.test('should call list with userId & orgId', function (done) {
    // ARRANGE
    var payload = {userId: 1, orgId: 2, ctrl: 'userOrg'};
    var profileListMock = {
      id: 'x',
      userId: payload.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user'
    };
    senecaStub.act
      .withArgs({role: 'cd-profiles', cmd: 'list', query: {userId: {in$: [payload.userId]}}})
      .callsFake(function (args, cb) {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({query: omit(payload, 'ctrl')}).once;
      expect(exportMock.org.search).to.have.been.calledWith({query: {id: {in$: [2]}}}).once;
      done();
    });
  });

  lab.test('should call list with query', function (done) {
    // ARRANGE
    var payload = {query: {userId: 1, orgId: 2}, ctrl: 'userOrg'};
    var profileListMock = {
      id: 'x',
      userId: payload.query.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user'
    };
    senecaStub.act
      .withArgs({role: 'cd-profiles', cmd: 'list', query: {userId: {in$: [payload.query.userId]}}})
      .callsFake(function (args, cb) {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({query: payload.query}).once;
      expect(exportMock.org.search).to.have.been.calledWith({query: {id: {in$: [2]}}}).once;
      done();
    });
  });
  lab.test('should combine params to call list with query', function (done) {
    // ARRANGE
    var payload = {userId: 1, query: {orgId: 2}, ctrl: 'userOrg'};
    var profileListMock = {
      id: 'x',
      userId: payload.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user'
    };
    senecaStub.act
      .withArgs({role: 'cd-profiles', cmd: 'list', query: {userId: {in$: [payload.userId]}}})
      .callsFake(function (args, cb) {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({query: {userId: payload.userId, orgId: payload.query.orgId}}).once;
      expect(exportMock.org.search).to.have.been.calledWith({query: {id: {in$: [2]}}}).once;
      done();
    });
  });
  lab.test('should extend the user info', function (done) {
    // ARRANGE
    var payload = {query: {userId: 1, orgId: 2}, ctrl: 'userOrg'};
    var profileListMock = {
      id: 'x',
      userId: payload.query.userId,
      name: 'John',
      email: 'bulbasaur@cd.org',
      userType: 'basic-user'
    };
    senecaStub.act
      .withArgs({role: 'cd-profiles', cmd: 'list', query: {userId: {in$: [payload.query.userId]}}})
      .callsFake(function (args, cb) {
        cb(null, [profileListMock]);
      });
    // ACT
    createOrg(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.export).to.have.been.calledTwice;
      expect(exportMock.userOrg.search).to.have.been.calledWith({query: payload.query}).once;
      expect(exportMock.org.search).to.have.been.calledWith({query: {id: {in$: [2]}}}).once;
      expect(val).to.be.array;
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
