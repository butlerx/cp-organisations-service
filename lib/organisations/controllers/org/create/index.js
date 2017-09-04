module.exports = () =>
  function create(args, cb) {
    const acts = this.export('cd-organisations/acts')[args.ctrl];
    const org = args.org;
    org.createdBy = args.user.id;
    org.createdAt = new Date();
    acts.save({ org }).asCallback(cb);
  };
