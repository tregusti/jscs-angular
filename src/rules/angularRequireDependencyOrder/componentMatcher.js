'use strict';

var spah   = require('spahql');
var format = require('util').format;

var getDependencyInstances = require('./getDependencyInstances');

module.exports = function(node) {
  var expression = spah.db(node);

  if (!expression.assert('/type=="CallExpression"')) { return; }

  var allowed = '"controller", "service", "factory", "directive", "provider", "config"';
  var query = '/callee[/type=="MemberExpression"]/property[/type=="Identifier"][/name }<{ {%s}]';
  var result = expression.select(format(query, allowed));
  if (!result.length) { return; }

  if (result.value().name === 'config') {
    // .config(function(deps...) {})
    query = '/arguments[/.size==1]/0';
  } else {
    // .controller('name', function(deps...) {})
    query = '/arguments[/.size==2]/1';
  }

  return getDependencyInstances(expression.select(query));
};
