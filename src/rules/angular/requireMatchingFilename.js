'use strict';

var assert = require('assert');
var casing = require('change-case');
var format = require('util').format;
var spah   = require('spahql');
var path   = require('path');
var type   = require('type-of')

var docLink = require('../../doc-linker');

// API

exports.name      = 'requireMatchingFilename';
exports.check     = check;
exports.configure = configure;

// API functions

function check(file, errors) {
  file.iterateNodesByType(['ExpressionStatement'], function(expression) {
    var status = angularDefinitionName(expression);

    if (status && status.valid) {
      var fileName = path.basename(file.getFilename());

      if (fileName === 'input') { return; }

      var baseName = path.basename(fileName, '.js');

      validateNames(errors, status.name, baseName, fileName, status.position);
    }
  });
}

function configure(value) {
  assert(
    value === true || type(value) === 'object',
    format(
      'Bad option value: %s. See documentation at %s',
      JSON.stringify(value),
      docLink(exports.name)
    )
  );

  option = value;
}

// Internals

var option;

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

function validateNames(errors, componentName, baseName, fileName, position) {
  if (option === true) {
    if (componentName !== baseName) {
      var msg = 'Defined name \'%s\' is not matching the filename \'%s\'';
      errors.add(format(msg, componentName, fileName), position);
    }
  } else {
    // File name check
    if (casing[option.filename](baseName) !== baseName) {
      var msg = 'File name \'%s\' is not matching the %s case rule';
      errors.add(format(msg, fileName, option.filename), { line: 1, column: 0 });
    }

    // Component name check
    if (casing[option.component](baseName) !== componentName) {
      var msg = 'Component name \'%s\' is not matching the %s case rule';
      // Move right 1 column to pint to name, not to string quotation.
      position.column++;
      errors.add(format(msg, componentName, option.component), position);
    }
  }
}
