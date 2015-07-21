# `angularRequireDependencyOrder`

This rule requires that angular dependencies are specified either `first` or `last` in a list of
dependencies for controllers, directives, factories, services, providers, configurations and resolve
objects. Both array and function syntax are supported.

## Value: `first`

### Valid function syntax example

```javascript
angular.module('app').controller('ValidController', function($scope, myService) {
  // ...
})
```

### Valid array syntax example

```javascript
angular.module('app')
  .controller('ValidController', ['$scope', 'myService', function($scope, myService) {
  // ...
}])
```

### Invalid example

```javascript
angular.module('app').controller('InvalidController', function(myService, $scope) {
  // ...
})
```

## Value: `last`

### Valid example

```javascript
angular.module('app').controller('ValidController', function(myService, $scope) {
  // ...
})
```

### Invalid example

```javascript
angular.module('app').controller('InvalidController', function($scope, myService) {
  // ...
})
```
