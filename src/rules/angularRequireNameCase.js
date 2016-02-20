'use strict';

var assert = require('assert');
var casing = require('change-case');
var format = require('util').format;
var spah   = require('spahql');
var path   = require('path');
var type   = require('type-of');

var docLink = require('../doc-linker');

var name = 'angularRequireNameCase';

// API functions

function check(file, errors) {
  file.iterateNodesByType(['ExpressionStatement'], function(expression) {
    var status = angularDefinitionName(expression);

    if (status && status.valid) {
      var fileName = path.basename(file.getFilename());

      if (fileName === 'input') { return; }

      var baseName = path.basename(fileName, '.js');

      validateNames(errors, status.type, status.name, baseName, fileName, status.position);
    }
  });
}

function configure(value) {
  validateOptions(value);

  option = value;
}

// Internals

var option;

function angularDefinitionName(node) {
  var data = spah.db(node);

  if (!data.assert('/type=="ExpressionStatement"')) { return false; }

  var expression = data.select('/expression');
  if (!expression.assert('/type=="CallExpression"')) { return false; }

  var allowed = '"controller", "service", "factory", "directive", "provider", "component"';
  var query = '/callee[/type=="MemberExpression"]/property[/type=="Identifier"][/name }<{ {%s}]';
  if (!expression.assert(format(query, allowed))) { return false; }

  var nameset = expression.select('/arguments[/.size==2]/0[/type=="Literal"]');
  if (!nameset.length) { return false; }

  var typeset =
    expression.select('/callee[/type=="MemberExpression"]/property[/type=="Identifier"]/name');

  return {
    valid: true,
    type: typeset.value(),
    name: nameset.value().value,
    position: nameset.value().loc.start
  };
}

function validateNames(errors, componentType, componentName, baseName, fileName, position) {
  var pair;
  if (type(option) === 'string') {
    option = {
      component: option,
      filename: option
    };
    pair = invalidNamePair(option, componentType, componentName, baseName, fileName);
    if (pair) {
      addErrors(errors, [pair]);
    }
  } else if (type(option) === 'object') {
    pair = invalidNamePair(option, componentType, componentName, baseName, fileName);
    if (pair) {
      addErrors(errors, [pair]);
    }
  } else if (type(option) === 'array') {
    var pairs = option.map(function(item) {
      return invalidNamePair(item, componentType, componentName, baseName, fileName);
    });

    var oneValid = pairs.some(function(value) {
      return value === false;
    });
    if (!oneValid) {
      addErrors(errors, pairs);
    }
  }

  function addErrors(errors, pairs) {
    pairs.forEach(function(pair) {
      if (pair) {
        pair.forEach(function(err) {
          errors.add(err.message, err.position);
        });
      }
    });
  }

  function invalidNamePair(option, componentType, componentName, baseName, fileName) {
    var out = [];
    var template, convert;

    // File name check
    convert = casingMethodFor(option.filename);
    if (convert(baseName) !== baseName) {
      template = 'File name \'%s\' is not matching the %s case rule';
      out.push({
        message: format(template, fileName, option.filename),
        position: { line: 1, column: 0 }
      });
    }

    // Component name check, force camel for directives
    var casing = option.component;
    if ('directive' === componentType || 'component' === componentType) {
      casing = 'camel';
    }
    convert = casingMethodFor(casing);
    if (convert(baseName) !== componentName) {
      template = 'Component name \'%s\' is not matching the %s case rule';
      // Move right 1 column to pin to name, not to string quotation.
      position.column++;
      out.push({
        message: format(template, componentName, option.component),
        position: position
      });
    }

    return out.length ? out : false;
  }
}

var casings = {
  'dot':      'dot',
  'dash':     'param', // diff
  'camel':    'camel',
  'snake':    'snake',
  'pascal':   'pascal',
  'constant': 'constant'
};

function casingMethodFor(value) {
  assert(
    Object.keys(casings).indexOf(value) !== -1,
    'Case option ' + value + ' is not available. See documentation at ' + docLink(name)
  );

  return casing[casings[value]];
}

function validateOptions(options) {
  if (type(options) === 'object') {
    validateOption(options);
    return;
  }

  if (type(options) === 'array') {
    options.forEach(validateOption);
    return;
  }

  assert(
    Object.keys(casings).indexOf(options) > -1,
    format(
      'Bad option value: %s. See documentation at %s',
      options,
      docLink(name)
    )
  );
}

function validateOption(option) {
  assert(
    option.filename,
    format(
      'Required property \'%s\' in %s. See documentation at %s',
      'filename',
      JSON.stringify(option),
      docLink(name)
    )
  );
  // Implicit validation
  casingMethodFor(option.filename);

  assert(
    option.component,
    format(
      'Required property \'%s\' in %s. See documentation at %s',
      'component',
      JSON.stringify(option),
      docLink(name)
    )
  );
  // Implicit validation
  casingMethodFor(option.component);
}

// Export API

require('../jscs-exporter')(module, name, configure, check);
