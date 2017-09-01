module.exports = () =>
  function list({ ctrl }, cb) {
    const acts = this.export('cd-organisations/acts')[ctrl];
    acts.search({ query: {} }).asCallback(cb);
  };
