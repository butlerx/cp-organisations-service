module.exports = () =>
  function create(args, cb) {
    const acts = this.export('cd-organisations/acts')[args.ctrl];
    const userOrg = args.userOrg;
    acts.save({ userOrg }).asCallback(cb);
  };
