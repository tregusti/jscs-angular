'use strict';

var getRouterDependencyInstances = require('./utils/getRouterDependencyInstances');

module.exports = function(memberExpression) {
  return getRouterDependencyInstances(memberExpression, '$stateProvider', 'state');
};
