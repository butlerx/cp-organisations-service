module.exports = function () {
  var ctx = this.context;
  return function (args, cb) {
    var acts = this.export('cd-organisations/acts')[args.ctrl];
    var id = args.id;
    acts.get({id: id})
    .asCallback(cb);
  };
};
