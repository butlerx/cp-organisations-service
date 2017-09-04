module.exports = () =>
  function isMemberOf({ user, params }, done) {
    const seneca = this;
    let allowed = false;
    const userId = user.id;
    const orgId = params.orgId || params.org.id;
    seneca.act(
      { role: 'cd-organisations', entity: 'userOrg', cmd: 'list', query: { orgId, userId } },
      (err, { length }) => {
        if (err) return done(null, { allowed: false });
        if (length > 0) allowed = true;
        return done(null, { allowed });
      },
    );
  };
