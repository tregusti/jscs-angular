'use strict';

var assert = require('assert');
var format = require('util').format;

var docLink = require('../doc-linker');
var dependencyExpression = require('../dependencyExpression');

var name = 'angularRequireDependencyOrder';

// API functions

function check(file, errors) {
  dependencyExpression.allFromNode(file).forEach(function(dependencyExpression) {
    checkParams(dependencyExpression, errors);
  });
}

function configure(option) {
  assert(
    option === 'first' || option === 'last',
    format('Bad option value: %s. See documentation at %s', option, docLink(name))
  );
  position = option;
}

// Internals

var position;

function checkParams(dependencyExpression, errors) {

  var dependencies = dependencyExpression.dependencies;

  var lastTrailingDependency = null;
  if (position === 'first') {

    dependencies.forEach(function(dependency) {
      if (dependency.name.substr(0, 1) !== '$' && !lastTrailingDependency) {
        lastTrailingDependency = dependency.name;
        return;
      }

      if (dependency.name.substr(0, 1) === '$' && lastTrailingDependency) {
        var message = format(
          'Angular dependency %s should be defined before %s',
          dependency.name,
          lastTrailingDependency
        );
        errors.add(message, dependency.loc.start);
      }
    });
  } else if (position === 'last') {
    dependencies.forEach(function(dependency) {
      if (dependency.name.substr(0, 1) === '$' && !lastTrailingDependency) {
        lastTrailingDependency = dependency.name;
        return;
      }

      if (dependency.name.substr(0, 1) !== '$' && lastTrailingDependency) {
        var message = format(
          'Custom dependency %s should be defined after %s',
          dependency.name,
          lastTrailingDependency
        );
        errors.add(message, dependency.loc.start);
      }
    });
  }
}

// Export API

require('../jscs-exporter')(module, name, configure, check);
