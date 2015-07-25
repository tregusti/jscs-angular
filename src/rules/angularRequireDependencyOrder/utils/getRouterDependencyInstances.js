var dependenciesFromInjectionPoint = require('./dependenciesFromInjectionPoint');

module.exports = function(memberExpression, objectName, propertyName) {
  // Assert the $routeProvider#when method was accessed.
  if (memberExpression.object.type !== 'Identifier') { return; }
  if (memberExpression.object.name !== objectName) { return; }
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

  var list = [];
  resolveProperty.value.properties.forEach(function(property) {
    var deps = dependenciesFromInjectionPoint(property.value);
    if (deps) {
      list.push(deps);
    }
  });

  return list;
}
