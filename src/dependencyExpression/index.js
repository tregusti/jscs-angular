'use strict';

var dependenciesFromDependencyExpression = require('./utils/dependenciesFromDependencyExpression');

/**
@constructor
@param {ArrayExpression|FunctionExpression} expression The expression that contains dependencies.
@param {String} type The type of dependecy expression. E.g `controller`, `config` or `resolve`.
@param {String} [name] Expression name, e.g. name of resolve property, controller name.
*/
function DependencyExpression(expression, type, name) {
  this.expression = expression;
  this.type = type;
  this.name = name || null;

  var dependencies;
  Object.defineProperty(this, 'dependencies', {
    get: function() {
      dependencies = dependencies || dependenciesFromDependencyExpression(this.expression);
      return dependencies;
    }
  });
}

DependencyExpression.prototype.contructor = DependencyExpression;

var matchers;
DependencyExpression.allFromNode = function(node) {
  matchers = matchers || loadMatchers();

  var allMatches = [];

  node.iterateNodesByType(['MemberExpression'], function(memberExpression) {
    matchers.forEach(function(matcher) {
      var matches = matcher(memberExpression);
      if (matches && matches.length) {
        allMatches = allMatches.concat(matches);
      }
    });
  });

  return allMatches;
};

function loadMatchers() {
  var names = ['componentMatcher', 'uiRouterMatcher', 'ngRouteMatcher'];
  return names.map(function(name) {
    return require('./matchers/' + name);
  });
}

module.exports = DependencyExpression;
