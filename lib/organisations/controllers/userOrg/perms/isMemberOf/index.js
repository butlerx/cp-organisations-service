module.exports = function () {
  return function (args, done) {
    var seneca = this;
    var allowed = false;
    var userId = args.user.id;
    var orgId = args.params.orgId || args.params.org.id;
    seneca.act({role: 'cd-organisations', entity: 'userOrg', cmd: 'list', query: {orgId: orgId, userId: userId}},
    function (err, userOrg) {
      if (err) return done(null, {'allowed': false});
      if (userOrg.length > 0) allowed = true;
      done(null, {'allowed': allowed});
    });
  };
};
