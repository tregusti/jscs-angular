/*global angular*/
var mod = angular.module('mod');
mod.controller('SomeController', function(a, b) {
  b.hello();
});

mod.service('BadOrderService', ['$q', '$http', 'something', function($q, $http, something) {
  $http.get('/');
  return something.property;
}]);
