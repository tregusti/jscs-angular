'use strict';

var assert = require('assert');
var type   = require('type-of');
var format = require('util').format;

var docLink = require('../doc-linker');
var DependencyExpression = require('../dependencyExpression');

var name = 'angularVerifyDependencyUsage';

// API functions

function check(file, errors) {
  if (!enabled) { return; }
  DependencyExpression.allFromNode(file).forEach(function(dependencyExpression) {
    checkExpression(dependencyExpression, errors);
  });
}

function configure(option) {
  assert(
    type(option) === 'boolean',
    format('Bad option value: %s. See documentation at %s', option, docLink(name))
  );

  enabled = option;
}

// Internals

var enabled;

function checkExpression(dependencyExpression, errors) {
  dependencyExpression.dependencies.forEach(function(dependency) {
    if (!findIdentifier(dependencyExpression.expression, dependency.name)) {
      errors.add("Dependency '" + dependency.name + "' is not used", dependency.loc.start);
    }
  });
}

function findIdentifier(object, name) {
  var found = false;

  if (object.type === 'ArrayExpression') {
    object = object.elements[object.elements.length - 1];
  }
  if (object.type === 'FunctionExpression') {
    object = object.body;
  }

  traverse(object);
  return found;

  function traverse(object) {
    if (found) { return; }
    if (object) {
      if (object.type === 'Identifier' && object.name === name) {
        found = true;
      } else if (type(object) === 'array') {
        object.forEach(traverse);
      } else if (type(object) === 'object') {
        Object.keys(object).forEach(function(key) {
          if (key.substr(0, 6) !== 'parent') {
            traverse(object[key]);
          }
        });
      }
    }
  }
}

// Export API

require('../jscs-exporter')(module, name, configure, check);