'use strict';

module.exports = function() {};

var validators = {};

module.exports.prototype.getOptionName = function() {
  return 'angular';
};

module.exports.prototype.configure = function(options) {
  // assert(typeof options === 'object', 'jsDoc option requires object value');

  var Ctor = require('./angular/requireAngularDependencyOrder');
  validators.requireAngularDependencyOrder = new Ctor();

  if (validators.requireAngularDependencyOrder.configure) {
    validators.requireAngularDependencyOrder.configure(options.requireAngularDependencyOrder);
  }
};

module.exports.prototype.check = function(file, errors) {
  validators.requireAngularDependencyOrder.check(file, errors);
};
