module.exports = function () {
  var ctx = this.context;
  return function (args, cb) {
    var acts = this.export('cd-organisations/acts')[args.ctrl];
    var orgId = args.orgId;
    acts.searchExtended({query: {orgId: orgId}})
    .asCallback(cb);
  };
};
