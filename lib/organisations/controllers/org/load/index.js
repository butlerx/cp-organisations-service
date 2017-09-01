module.exports = () =>
  function load({ ctrl, id }, cb) {
    const acts = this.export('cd-organisations/acts')[ctrl];
    acts.get({ id }).asCallback(cb);
  };
