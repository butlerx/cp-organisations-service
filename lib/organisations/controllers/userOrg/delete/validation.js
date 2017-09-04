const { pick } = require('lodash');

module.exports = definition => pick(definition, ['userId', 'orgId']);
