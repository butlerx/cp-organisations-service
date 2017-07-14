var _ = require('lodash');
/**
 * Originally supposed to allow to filter upon name/email from an org
 * through a view
 * Nowadays, only return the described fields in association to the org
 * @return {Array} Objects containing the user name & mail associated with the org
 */
module.exports = function () {
  var ctx = this.context;
  return function (args, cb) {
    var acts = this.export('cd-organisations/acts')[args.ctrl];
    var seneca = this;
    var orgId = args.orgId;
    var userId = args.userId;
    var query = args.query || {};
    if (userId) query.userId = userId;
    if (orgId) query.orgId = orgId;
    acts.search({query: query})
    .then(function (userOrgs) {
      if (userOrgs.length > 0) {
        var userIds = _.map(userOrgs, 'userId');
        seneca.act({role: 'cd-profiles', cmd: 'list', query: {userId: {in$: userIds}}},
        function (err, users) {
          if (err) return cb(err);
          var userOrgsExtended = _.map(userOrgs, function (userOrg) {
            var user = _.find(users, { userId: userOrg.userId });
            userOrg.username = user.name;
            userOrg.email = user.email;
            userOrg.userType = user.userType;
            userOrg.orgName = userOrg.name;
            delete userOrg.name;
            return userOrg;
          });
          cb(null, userOrgsExtended);
        });
      } else {
        cb(null, []);
      }
    });
  };
};
