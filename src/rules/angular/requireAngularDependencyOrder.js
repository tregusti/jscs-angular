'use strict';

var assert = require('assert');
var format = require('util').format;

var docLink = require('../../doc-linker');

// API

exports.name      = 'requireAngularDependencyOrder';
exports.check     = check;
exports.configure = configure;

// API functions

function check(file, errors) {
  var matchers = ['componentMatcher', 'uiRouterMatcher'];
  matchers = matchers.map(function(matcher) {
    return require('./requireAngularDependencyOrder/' + matcher + '.js');
  });

  file.iterateNodesByType(['CallExpression'], function(expression) {
    matchers.forEach(function(matcher) {
      var instances = matcher(expression);
      if (instances) {
        checkParams(instances, errors);
      }
    });
  });
}

function configure(option) {
  assert(
    option === 'first' || option === 'last',
    format('Bad option value: %s. See documentation at %s', option, docLink(exports.name))
  );
  position = option;
}

// Internals

var position;

function checkParams(instances, errors) {
  instances.forEach(function(instance) {
    var lastTrailingDependency = null;
    if (position === 'first') {

      instance.forEach(function(param) {
        if (param.name.substr(0, 1) !== '$' && !lastTrailingDependency) {
          lastTrailingDependency = param.name;
          return;
        }

        if (param.name.substr(0, 1) === '$' && lastTrailingDependency) {
          var message = format(
            'Angular dependency %s should be defined before %s',
            param.name,
            lastTrailingDependency
          );
          errors.add(message, param.loc.start);
        }
      });
    } else if (position === 'last') {
      instance.forEach(function(param) {
        if (param.name.substr(0, 1) === '$' && !lastTrailingDependency) {
          lastTrailingDependency = param.name;
          return;
        }

        if (param.name.substr(0, 1) !== '$' && lastTrailingDependency) {
          var message = format(
            'Custom dependency %s should be defined after %s',
            param.name,
            lastTrailingDependency
          );
          errors.add(message, param.loc.start);
        }
      });
    }
  });
}
