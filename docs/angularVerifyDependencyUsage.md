# `angularVerifyDependencyUsage`

This option verifies that specified dependencies in and angular injectable expression is not unused.

## Example

With this configuration:

```json
{
  "angularVerifyDependencyUsage": true
}
```

This code would be valid:

```javascript
angular.module('app').service('GoodService', function($http) {
  this.fetch = function() {
    return $http.get('/items')
  }
})
```

However, this code would be invalid:

```javascript
angular.module('app').service('BadService', function($q, $http) {
  this.fetch = function() {
    return $http.get('/items')
  }
})
```

The difference is that the second example specifies a dependency on `$q` that is not used anywhere
in the service.
