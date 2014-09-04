'use strict';

module.exports = function() {
  this._validators = [];
};

module.exports.prototype.getOptionName = function() {
  return 'angular';
};

module.exports.prototype.configure = function(options) {
  var validators = this._validators;

  var rules = ['requireMatchingFilename', 'requireAngularDependencyOrder'];

  rules.forEach(function(name) {
    validators[name] = new (require('./angular/' + name))();

    if (validators[name].configure) {
      validators[name].configure(options[name]);
    }
  });
};

module.exports.prototype.check = function(file, errors) {
  // Object.keys(validators).forEach(function (name) {
  //   validators[name].check(file, errors);
  // });
  this._validators.requireAngularDependencyOrder.check(file, errors);
  this._validators.requireMatchingFilename.check(file, errors);
};
