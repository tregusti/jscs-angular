'use strict';

var DependencyExpression = require('..');

module.exports = function(memberExpression) {
  var allowedWithName = ['controller', 'service', 'factory', 'directive', 'provider'];
  var allowedWithoutName = ['config'];

  if (memberExpression.property.type !== 'Identifier') { return; }

  var type = memberExpression.property.name;
  var returnValue = [];

  if (allowedWithName.indexOf(type) >= 0) {
    var name;

    var callExpression = memberExpression.parentNode;
    if (callExpression && callExpression.type === 'CallExpression') {
      var arg = callExpression.arguments[0];
      if (arg && arg.type === 'Literal') {
        name = arg.value;
      }
    }

    returnValue.push(new DependencyExpression(parseWithName(memberExpression), type, name));
  }

  if (allowedWithoutName.indexOf(type) >= 0) {
    returnValue.push(new DependencyExpression(parseWithoutName(memberExpression), type));
  }

  return returnValue;
};

function parseWithoutName(memberExpression) {
  return getDependencyExpression(memberExpression, 0);
}

function parseWithName(memberExpression) {
  return getDependencyExpression(memberExpression, 1);
}

function getDependencyExpression(memberExpression, argumentIndex) {
  // Verify CallExpression `MemberExpression(..., Function|Array)`.
  var callExpression = memberExpression.parentNode;
  if (!callExpression) { return; }
  if (callExpression.type !== 'CallExpression') { return; }

  var arg = callExpression.arguments[argumentIndex];
  if (!arg) { return; }

  if (/ArrayExpression|FunctionExpression/.test(arg.type)) {
    return arg;
  }
}
