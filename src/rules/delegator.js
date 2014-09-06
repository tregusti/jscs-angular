'use strict';

var format = require('util').format;
var assert = require('assert');

var docLink = require('../doc-linker');

module.exports = function() {
  this._validators = [];
};

module.exports.prototype.getOptionName = function() {
  return 'angular';
};

module.exports.prototype.configure = function(options) {
  assert(
    /Object/.test({}.toString.call(options)),
    format('Value for angular rule must be an object. See documentation at %s', docLink('usage'))
  );

  var validators = this._validators;

  var rules = ['requireMatchingFilename', 'requireAngularDependencyOrder'];

  rules.forEach(function(name) {
    if (options.hasOwnProperty(name)) {
      validators[name] = new (require('./angular/' + name))();

      if (validators[name].configure) {
        validators[name].configure(options[name]);
      }
    }
  });
};

module.exports.prototype.check = function(file, errors) {
  var validators = this._validators;

  Object.keys(validators).forEach(function (name) {
    validators[name].check(file, errors);
  });
};
