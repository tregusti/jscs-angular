/*global angular*/
angular.module('mod').config(function(alpha, beta) {
  alpha(beta.value());
});

angular.module('mod').controller('Controller', function($scope, config) {
  $scope.url = config.url;
});
