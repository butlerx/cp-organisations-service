module.exports = () =>
  function deletefn({ ctrl, userId, orgId }, cb) {
    const acts = this.export('cd-organisations/acts')[ctrl];
    acts.delete({ query: { userId, orgId } }).asCallback(cb);
  };
