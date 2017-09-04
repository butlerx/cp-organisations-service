const _ = require('lodash');
/**
 * Originally supposed to allow to filter upon name/email from an org
 * through a view
 * Nowadays, only return the described fields in association to the org
 * @return {Array} Objects containing the user name & mail associated with the org
 */
module.exports = () =>
  function list(args, cb) {
    const userOrg = this.export('cd-organisations/acts')[args.ctrl];
    const orgs = this.export('cd-organisations/acts').org;
    const seneca = this;

    // Params
    const orgId = args.orgId;
    const userId = args.userId;
    const query = args.query || {};
    if (userId) query.userId = userId;
    if (orgId) query.orgId = orgId;

    let userOrgs = [];
    userOrg
      .search({ query })
      .then((_userOrgs) => {
        userOrgs = _userOrgs;
        if (userOrgs.length > 0) {
          return orgs.search({ query: { id: { in$: _.map(userOrgs, 'orgId') } } });
        }
      })
      .then((orgsLocal) => {
        if (userOrgs && userOrgs.length > 0) {
          const userIds = _.map(userOrgs, 'userId');
          seneca.act(
            { role: 'cd-profiles', cmd: 'list', query: { userId: { in$: userIds } } },
            (err, users) => {
              if (err) return cb(err);
              const userOrgsExtended = _.map(userOrgs, (userOrgLocal) => {
                const user = _.find(users, { userId: userOrgLocal.userId });
                // clearly suboptimal if lot of users : better index/id
                const org = _.find(orgsLocal, { id: userOrgLocal.orgId });
                userOrgLocal.username = user.name;
                userOrgLocal.email = user.email;
                userOrgLocal.userType = user.userType;
                userOrgLocal.orgName = org.name;
                return userOrgLocal;
              });
              return cb(null, userOrgsExtended);
            },
          );
        } else {
          return cb(null, []);
        }
      });
  };
