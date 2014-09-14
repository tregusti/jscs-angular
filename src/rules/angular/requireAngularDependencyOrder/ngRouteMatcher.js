'use strict';

var spah = require('spahql');

var getDependencyInstances = require('./getDependencyInstances');

module.exports = function(node) {
  var callExpression = spah.db(node);

  // Assert the $stateProvider#state method was invoked.
  if (!callExpression.assert('/callee[/type=="MemberExpression"]')) { return; }
  if (!callExpression.assert('/callee/object[/name=="$routeProvider"]')) { return; }
  if (!callExpression.assert('/callee/property[/type=="Identifier"][/name=="when"]')) { return; }

  // Get all object properties sent to .state()
  var props = callExpression.select('/arguments/1[/type=="ObjectExpression"]/properties');
  // Get all properties sent into resolve object
  var resolve = props.select('/*/[/key/type=="Identifier"][/key/name=="resolve"]/value/properties');

  // Assert we have a resolve object
  if (!resolve.length) { return; }

  return getDependencyInstances(resolve.select('/*/value'));
};
