'use strict';

var base;

module.exports = function(rulename) {
  base = base || (function() {
    var json = require('../package.json');
    return json.homepage;
  }());

  return base + '#' + rulename.toLowerCase();
};
