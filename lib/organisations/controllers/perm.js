var glob = require('glob');
var _ = require('lodash');
var path = require('path');
/**
 * Aggregate all permissions functions/imports into one for cp-perm
 * @return {Object} Extend of all perms
 */
module.exports = function () {
  var perms = {'cd-organisations': {}};
  // the /*/** focus on anything at least one level beyond itself
  var files = glob.sync('./*/**/perm.js', {cwd: __dirname});
  _.each(files, function (file) {
    var ctrl = file.split(path.sep)[1]; // 0 = ., 1 = ctrlName
    var perm = require(file);
    if (!perms['cd-organisations'][ctrl]) perms['cd-organisations'][ctrl] = {};
    if (typeof (perm) === 'function') {
      perms['cd-organisations'][ctrl] = _.extend(perms['cd-organisations'][ctrl], perm());
    } else {
      perms['cd-organisations'][ctrl] = _.extend(perms['cd-organisations'][ctrl], perm);
    }
  });
  return perms;
};
