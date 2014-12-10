/*global angular*/
angular.module('mod').directive('bad', function() {

  var something = true;

  return {
    restrict: 'C',
    compile: function() {
      throw 'Not implemented';
    }
  };

});
