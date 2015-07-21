'use strict';

var assert = require('assert');
var type   = require('type-of');
var format = require('util').format;
var spah   = require('spahql');

var docLink = require('../doc-linker');

var name = 'angularAllowDirectiveRestrictions';

// API functions

function check(file, errors) {
  file.iterateNodesByType(['CallExpression'], function(call) {

    var data = spah.db(call);

    // Assert callee type
    if (!data.assert('/callee[/type=="MemberExpression"]')) { return; }

    // Assert directive method invokation
    if (!data.assert('/callee/property[/type=="Identifier"][/name=="directive"]')) { return; }

    // Assert constructor function defined
    if (!data.assert('/arguments/1[/type=="FunctionExpression"][/body[/type=="BlockStatement"]]')) {
      return;
    }

    // Select returned object
    var obj = data.select('/arguments/1/body/body/*[/type=="ReturnStatement"]/argument');

    // Select properties
    var props = obj.select('/[/type=="ObjectExpression"]/properties/*[/type=="Property"]');

    // Select restrictions property
    var rest = props.select('/[/key/name=="restrict"]/value[/type=="Literal"]').value();

    // Verify presence of restrict property
    if (!rest) { return; }

    // Verify we can validate the value
    if (type(rest.value) !== 'string') { return; }

    var pos = rest.loc.start;
    // Move forward past quotation.
    pos.column++;

    rest.value.split('').forEach(function(letter, index) {
      if (validRestrictions.indexOf(letter) === -1) {
        pos.column += index;
        var message = format('Directive restrictions to %s is not allowed', letter);
        errors.add(message, pos);
      }
    });

  });
}

function configure(option) {
  assert(
    type(option) === 'string',
    format('Bad option value: %s. See documentation at %s', option, docLink(name))
  );

  var valid = 'ECMA';
  option.split('').forEach(function(c) {
    assert(
      valid.indexOf(c) >= 0,
      format('Bad option value: %s. See documentation at %s', c, docLink(name))
    );
  });

  validRestrictions = option;
}

// Interals

var validRestrictions;

// Export API

require('../jscs-exporter')(module, name, configure, check);
