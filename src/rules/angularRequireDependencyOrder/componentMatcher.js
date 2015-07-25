'use strict';

var dependenciesFromInjectionPoint = require('./utils/dependenciesFromInjectionPoint');

module.exports = function(memberExpression) {
  var allowedWithName = ['controller', 'service', 'factory', 'directive', 'provider'];
  var allowedWithoutName = ['config'];

  if (memberExpression.property.type !== 'Identifier') { return; }

  if (allowedWithName.indexOf(memberExpression.property.name) >= 0) {
    return parseWithName(memberExpression);
  }

  if (allowedWithoutName.indexOf(memberExpression.property.name) >= 0) {
    return parseWithoutName(memberExpression);
  }
};

function parseWithoutName(memberExpression) {
  var expression = getInjectionExpression(memberExpression, 0);
  return [dependenciesFromInjectionPoint(expression)];
}

function parseWithName(memberExpression) {
  var expression = getInjectionExpression(memberExpression, 1);
  return [dependenciesFromInjectionPoint(expression)];
}

function getInjectionExpression(memberExpression, argumentIndex) {
  // Verify CallExpression `MemberExpression(..., Function)`.
  var callExpression = memberExpression.parentNode;
  if (callExpression.type !== 'CallExpression') { return; }

  if (callExpression.arguments[argumentIndex].type === 'FunctionExpression') {
    return callExpression.arguments[argumentIndex];
  }

  if (callExpression.arguments[argumentIndex].type === 'ArrayExpression') {
    return callExpression.arguments[argumentIndex];
  }
}
