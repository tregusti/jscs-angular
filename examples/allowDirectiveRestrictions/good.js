/*global angular*/
angular.module('mod').directive('good', function() {

  var whatever = true;

  return {
    restrict: 'E',
    compile: function() {
      throw 'Not implemented';
    }
  };

});
