'use strict';

var lab = exports.lab = require('lab').script();
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');
var fn = require('./index');

lab.experiment('perm/isMemberOf', function () {
  var isMemberOf, sandbox, senecaStub;
  lab.beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    senecaStub = {
      act: sandbox.stub()
    };
    isMemberOf = fn().bind(senecaStub);
    done();
  });

  lab.afterEach(function (done) {
    sandbox.restore();
    done();
  });

  lab.test('should allow only member of the passed organisation', function (done) {
    // ARRANGE
    var payload = {user: {id: 1}, params: {orgId: 2}};
    var profileListMock = {
      id: 'x',
      userId: payload.user.id,
      orgId: payload.orgId,
      orgName: 'banana',
      username: 'John'
    };
    senecaStub.act
      .withArgs({role: 'cd-organisations', entity: 'userOrg', cmd: 'list',
       query: {orgId: payload.params.orgId, userId: payload.user.id}})
      .callsFake(function (args, cb) {
        cb(null, [profileListMock]);
      });
    // ACT
    isMemberOf(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.act).to.have.been.calledOnce;
      expect(val.allowed).to.be.true;
      done();
    });
  });

  lab.test('should refuse member of the passed organisation', function (done) {
    // ARRANGE
    var payload = {user: {id: 1}, params: {orgId: 2}};

    senecaStub.act
      .withArgs({role: 'cd-organisations', entity: 'userOrg', cmd: 'list',
       query: {orgId: payload.params.orgId, userId: payload.user.id}})
      .callsFake(function (args, cb) {
        cb(null, []);
      });
    // ACT
    isMemberOf(payload, function (err, val) {
      expect(err).to.not.exists;
      expect(senecaStub.act).to.have.been.calledOnce;
      expect(val.allowed).to.be.false;
      done();
    });
  });
});
