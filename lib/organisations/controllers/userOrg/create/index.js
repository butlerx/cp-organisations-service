module.exports = function () {
  var ctx = this.context;
  return function (args, cb) {
    var acts = this.export('cd-organisations/acts')[args.ctrl];
    var userOrg = args.userOrg;
    acts.save({userOrg: userOrg})
    .asCallback(cb);
  };
};
