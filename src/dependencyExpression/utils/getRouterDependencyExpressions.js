'use strict';

var DependencyExpression = require('..');

module.exports = function(memberExpression, objectName, propertyName) {
  // Assert the member was accessed on $routeProvider.
  if (memberExpression.object.type !== 'Identifier') { return; }
  if (memberExpression.object.name !== objectName) { return; }

  var list = [];
  extractDependencyExpressions(memberExpression, list, propertyName);
  return list;
};

function extractDependencyExpressions(memberExpression, list, propertyName) {
  // Assert the #when method was accessed.
  if (memberExpression.type !== 'MemberExpression') { return; }
  if (memberExpression.property.type !== 'Identifier') { return; }
  if (memberExpression.property.name !== propertyName) { return; }

  // Verify CallExpression `MemberExpression(any, object)`.
  var callExpression = memberExpression.parentNode;
  if (callExpression.type !== 'CallExpression') { return; }
  if (callExpression.arguments.length !== 2) { return; }
  if (callExpression.arguments[1].type !== 'ObjectExpression') { return; }

  // Fetch resolve Property if present
  var properties = callExpression.arguments[1].properties;
  var resolveProperty = properties.filter(function(property) {
    return property.key.type === 'Identifier' &&
           property.key.name === 'resolve' &&
           property.value.type === 'ObjectExpression';
  })[0];

  if (!resolveProperty) { return; }

  resolveProperty.value.properties.forEach(function(property) {
    var name = property.key && property.key.type === 'Identifier' ? property.key.name : null;
    list.push(new DependencyExpression(property.value, 'resolve', name));
  });

  extractDependencyExpressions(callExpression.parentNode, list, propertyName);
}
