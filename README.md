# jscs-angular

[![Build Status](https://travis-ci.org/tregusti/jscs-angular.svg?branch=master)](https://travis-ci.org/tregusti/jscs-angular)
[![Dependency Status](https://david-dm.org/tregusti/jscs-angular.svg?theme=shields.io)](https://david-dm.org/tregusti/jscs-angular)
[![devDependency Status](https://david-dm.org/tregusti/jscs-angular/dev-status.svg?theme=shields.io)](https://david-dm.org/tregusti/jscs-angular#info=devDependencies)

[AngularJS](https://angularjs.org/) plugin for [JSCS](https://github.com/jscs-dev/node-jscs).

## Plugin installation

`jscs-angular` can be installed using `npm`:

    npm install jscs-angular

If you need it globally:

    npm --global install jscs-angular

## Usage

To use plugin you should add it to your configuration file, e.g. `.jscsrc`:

```json
{
    "additionalRules": [
        "node_modules/jscs-angular/src/rules/*.js"
    ],
    "angular": {

    }
}
```

## Configuration options

All options are placed within the `angular` option in your `jscs` configuration.

* [`requireAngularDependencyOrder`](#requireangulardependencyorder)
* [`requireMatchingFilename`](#requirematchingfilename)

### `requireAngularDependencyOrder`

This rule requires that angular dependencies are specified either `first` or `last` in a list of
dependencies for controllers, directives, factories, services, providers and configurations.

#### Value: `first`

##### Valid example

```javascript
angular.module('app').controller('ValidController', function ($scope, myService) {
  // ...
})
```

##### Invalid example

```javascript
angular.module('app').controller('InvalidController', function (myService, $scope) {
  // ...
})
```

#### Value: `last`

##### Valid example

```javascript
angular.module('app').controller('ValidController', function (myService, $scope) {
  // ...
})
```

##### Invalid example

```javascript
angular.module('app').controller('InvalidController', function ($scope, myService) {
  // ...
})
```

### `requireMatchingFilename`

This rule requires that the filename without extension exactly matches the name defined in the file.
It must have the value `true` or shall not be present.

##### Valid example

In a file named `assets/GoodController.js`:

```javascript
angular.module('app').controller('GoodController', function() {

})
```

##### Invalid example

In a file named `assets/BadController.js`:

```javascript
angular.module('app').controller('BadCtrl', function() {

})
```

## Browser support

This functionality have not been tested at all, since I personally have no need for it.
