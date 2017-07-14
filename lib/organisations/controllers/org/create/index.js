module.exports = function () {
  var ctx = this.context;
  return function (args, cb) {
    var acts = this.export('cd-organisations/acts')[args.ctrl];
    var org = args.org;
    org.createdBy = args.user.id;
    org.createdAt = new Date();
    acts.save({org: org})
    .asCallback(cb);
  };
};
