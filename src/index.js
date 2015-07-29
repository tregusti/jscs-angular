'use strict';

var fs = require('fs');
var path = require('path');

/**
@param {Configuration} config JSCS configuration object.
*/
module.exports = function(config) {
  var rules = path.join(__dirname, 'rules');
  fs.readdirSync(rules).forEach(function(filename) {
    config.registerRule(require(path.join(rules, filename)));
  });
};
