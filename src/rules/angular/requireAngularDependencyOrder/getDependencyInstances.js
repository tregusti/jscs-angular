'use strict';

/**
* Parses out dependency instances for both array syntax and for function syntax.
*
* It will return a list of instances like:
*
* ```json
* [
*   [{
*     name: 'depName1',
*     loc: {} // location object
*   }, {
*     name: 'depName2',
*     loc: {} // location object
*   }], [{
*     name: 'depName3',
*     loc: {} // location object
*   }, {
*     name: 'depName4',
*     loc: {} // location object
*   }]
* ]
* ```
*
* @param {SpahQL} list - A list of definitions, in array or function syntax.
* @returns {Array} - A list of instances of dependency lists
*/
module.exports = function getDependencyInstances(list) {

  var instances = [];

  // Function syntax
  list.select('/[/type=="FunctionExpression"]').each(function() {
    var instance = this.select('/params/*[/type=="Identifier"]').values().map(function(param) {
      return {
        loc: param.loc,
        name: param.name
      };
    });

    instances.push(instance);
  });

  list.select('/[/type=="ArrayExpression"]').each(function() {
    var instance = this.select('/elements/*[/type=="Literal"]').values().map(function(param) {
      param.loc.start.column++;
      return {
        loc: param.loc,
        name: param.value
      };
    });

    instances.push(instance);
  });

  return instances;
};
