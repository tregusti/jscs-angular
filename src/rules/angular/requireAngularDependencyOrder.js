'use strict';

var assert = require('assert');
var format = require('util').format;
var spah = require('spahql');

var docLink = require('../../doc-linker');

module.exports = function () {};

module.exports.prototype.check = function check(file, errors) {
  var self = this;
  self._errors = errors;
  file.iterateNodesByType(['ExpressionStatement'], function(expression) {
    var status = angularDefinitionStatus(expression);
    if (status.valid) {
      checkParams(self, status.params);
    }
  });
};

module.exports.prototype.getOptionName = function() {
  return 'requireAngularDependencyOrder';
};

module.exports.prototype.configure = function configure(position) {
  assert(
    position === 'first' || position === 'last',
    format('Bad option value: %s. See documentation at %s', position, docLink(this.getOptionName()))
  );
  this._position = position;
};
module.exports.prototype.error = function error(str, pos) {
  this._errors.add(str, pos);
};

function angularDefinitionStatus(node) {
  var data = spah.db(node);

  if (!data.assert('/type=="ExpressionStatement"')) { return false; }

  var expression = data.select('/expression');
  if (!expression.assert('/type=="CallExpression"')) { return false; }

  var allowed = '"controller", "service", "factory", "directive", "provider", "config"';
  var query = '/callee[/type=="MemberExpression"]/property[/type=="Identifier"][/name }<{ {%s}]';
  if (!expression.assert(format(query, allowed))) { return false; }

  var params = expression.select('/arguments[/.size==2]/1[/type=="FunctionExpression"]/params');
  if (!params.length) { return false; }

  return {
    valid: true,
    params: params.value()
  };
}

function checkParams(instance, params) {
  var lastTrailingDependency = null;
  if (instance._position === 'first') {

    params.forEach(function (param) {
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
        instance.error(message, param.loc.start);
      }
    });
  } else if (instance._position === 'last') {
    params.forEach(function (param) {
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
        instance.error(message, param.loc.start);
      }
    });
  }
}
