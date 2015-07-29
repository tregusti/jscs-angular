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
  return expression ? [dependenciesFromInjectionPoint(expression)] : [];
}

function parseWithName(memberExpression) {
  var expression = getInjectionExpression(memberExpression, 1);
  return expression ? [dependenciesFromInjectionPoint(expression)] : [];
}

function getInjectionExpression(memberExpression, argumentIndex) {
  // Verify CallExpression `MemberExpression(..., Function|Array)`.
  var callExpression = memberExpression.parentNode;
  if (callExpression.type !== 'CallExpression') { return; }

  var arg = callExpression.arguments[argumentIndex];
  if (!arg) { return; }

  if (/ArrayExpression|FunctionExpression/.test(arg.type)) {
    return arg;
  }
}
