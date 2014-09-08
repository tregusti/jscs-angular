'use strict';

var assert = require('assert');
var format = require('util').format;
var spah   = require('spahql');

var docLink = require('../../doc-linker');

// API

exports.name      = 'requireAngularDependencyOrder';
exports.check     = check;
exports.configure = configure;

// API functions

function check(file, errors) {
  file.iterateNodesByType(['ExpressionStatement'], function(expression) {
    var status = angularDefinitionStatus(expression);
    if (status.valid) {
      checkParams(status.params, errors);
    }
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

function angularDefinitionStatus(node) {
  var data = spah.db(node);

  if (!data.assert('/type=="ExpressionStatement"')) { return false; }

  var expression = data.select('/expression');
  if (!expression.assert('/type=="CallExpression"')) { return false; }

  var allowed = '"controller", "service", "factory", "directive", "provider", "config"';
  var query = '/callee[/type=="MemberExpression"]/property[/type=="Identifier"][/name }<{ {%s}]';
  var result = expression.select(format(query, allowed));
  if (!result.length) { return false; }

  if (result.value().name === 'config') {
    // .config(function(deps...) {})
    query = '/arguments[/.size==1]/0[/type=="FunctionExpression"]/params';
  } else {
    // .controller('name', function(deps...) {})
    query = '/arguments[/.size==2]/1[/type=="FunctionExpression"]/params';
  }

  var params = expression.select(query);
  if (!params.length) { return false; }

  return {
    valid: true,
    params: params.value()
  };
}

function checkParams(params, errors) {
  var lastTrailingDependency = null;
  if (position === 'first') {

    params.forEach(function(param) {
      if (param.type !== 'Identifier') { return; }

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
    params.forEach(function(param) {
      if (param.type !== 'Identifier') { return; }

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
}
