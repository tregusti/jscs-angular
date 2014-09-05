'use strict';

var assert = require('assert');
var format = require('util').format;
var spah = require('spahql');
var path = require('path');

var docLink = require('../../doc-linker');

module.exports = function () {};

module.exports.prototype.check = function check(file, errors) {
  file.iterateNodesByType(['ExpressionStatement'], function(expression) {
    var status = angularDefinitionName(expression);

    if (status.valid) {
      var filename = path.basename(file.getFilename());

      if (filename === 'input') { return; }

      if (status.name !== path.basename(filename, '.js')) {
        var msg = 'Defined name \'%s\' is not matching the filename \'%s\'.';
        errors.add(format(msg, status.name, filename), status.position);
      }
    }
  });
};

module.exports.prototype.getOptionName = function() {
  return 'requireMatchingFilename';
};

module.exports.prototype.configure = function configure(value) {
  assert(
    value === true,
    format('Bad option value: %s. See documentation at %s', value, docLink(this.getOptionName()))
  );

  this._value = value;
};

function angularDefinitionName(node) {
  var data = spah.db(node);

  if (!data.assert('/type=="ExpressionStatement"')) { return false; }

  var expression = data.select('/expression');
  if (!expression.assert('/type=="CallExpression"')) { return false; }

  var allowed = '"controller", "service", "factory", "directive", "provider"';
  var query = '/callee[/type=="MemberExpression"]/property[/type=="Identifier"][/name }<{ {%s}]';
  if (!expression.assert(format(query, allowed))) { return false; }

  var nameset = expression.select('/arguments[/.size==2]/0[/type=="Literal"]');
  if (!nameset.length) { return false; }

  return {
    valid: true,
    name: nameset.value().value,
    position: nameset.value().loc.start
  };
}
