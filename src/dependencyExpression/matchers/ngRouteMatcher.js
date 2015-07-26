'use strict';

var getRouterDependencyExpressions = require('../utils/getRouterDependencyExpressions');

module.exports = function(memberExpression) {
  return getRouterDependencyExpressions(memberExpression, '$routeProvider', 'when');
};
