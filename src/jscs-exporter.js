'use strict';

module.exports = function(ruleModule, name, configure, check) {
  ruleModule.exports = function() {};
  ruleModule.exports.prototype.check         = check;
  ruleModule.exports.prototype.configure     = configure;
  ruleModule.exports.prototype.getOptionName = function() {
    return name;
  };
};
