// curl 'http://localhost:10307/act'  -H 'Content-Type: application/json' --data-binary '{"cmd": "create", "ctrl":"app", "role":"cd-sso", "app": {"name":"aaaa123", "url":"sqdqsd", "callbackUrl":"http://localhost:3002/auth/example-oauth2orize/callback", "tosUrl":"qsd", "iconUrl":"http://www.namiscorporate.com/images/D3.png", "privacyUrl":"qsd", "secretKey":"secret", "fields":["profile"]}, "user":{"id":23}}'
module.exports = function () {
  var ctx = this.context;
  return function (args, cb) {
    var acts = this.export('cd-organisations/acts')[args.ctrl];
    var org = args.org;
    org.createdBy = args.user.id;
    org.createdAt = new Date();
    acts.save({org: org})
    .asCallback(cb);
  };
};
