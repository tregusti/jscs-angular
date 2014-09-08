# jscs-angular

[![Version](http://img.shields.io/npm/v/jscs-angular.svg)](https://www.npmjs.org/package/jscs-angular)
[![Build Status](https://travis-ci.org/tregusti/jscs-angular.svg?branch=master)](https://travis-ci.org/tregusti/jscs-angular)
[![Dependency Status](https://david-dm.org/tregusti/jscs-angular.svg?theme=shields.io)](https://david-dm.org/tregusti/jscs-angular)
[![devDependency Status](https://david-dm.org/tregusti/jscs-angular/dev-status.svg?theme=shields.io)](https://david-dm.org/tregusti/jscs-angular#info=devDependencies)
[![Gratipay](http://img.shields.io/gratipay/tregusti.svg)](https://gratipay.com/tregusti/)

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

* [`allowDirectiveRestrictions`](#allowdirectiverestrictions)
* [`requireAngularDependencyOrder`](#requireangulardependencyorder)
* [`requireMatchingFilename`](#requirematchingfilename)

### `allowDirectiveRestrictions`

This option allow you to specify valid restrictions for directives. The value is a string with one
or more of `E`, `C`, `M` and `A`.

### Example

With this configuration:

```json
{
  "angular": {
    "allowDirectiveRestrictions": "EA"
  }
}
```

This directive would be valid:

```javascript
angular.module('app').directive('goodDirective', function() {
  return {
    restrict: 'E'
  }
});
```

However, this directive would be invalid:

```javascript
angular.module('app').directive('badDirective', function() {
  return {
    restrict: 'M'
  }
});
```

### `requireAngularDependencyOrder`

This rule requires that angular dependencies are specified either `first` or `last` in a list of
dependencies for controllers, directives, factories, services, providers and configurations.

#### Value: `first`

##### Valid example

```javascript
angular.module('app').controller('ValidController', function($scope, myService) {
  // ...
})
```

##### Invalid example

```javascript
angular.module('app').controller('InvalidController', function(myService, $scope) {
  // ...
})
```

#### Value: `last`

##### Valid example

```javascript
angular.module('app').controller('ValidController', function(myService, $scope) {
  // ...
})
```

##### Invalid example

```javascript
angular.module('app').controller('InvalidController', function($scope, myService) {
  // ...
})
```

### `requireMatchingFilename`

This rule ha two different modes. If the value `true` is supplied, it requires that the filename
without extension exactly matches the name defined in the file. No matter the casing of he name.

If the value is an object or an array of objects, the object define a rule that the names must follow.
For instance, you can require that the file name should be dash cased like `my-thing.js`, and the
corresponding component name should be pascal cased like `MyThing`.

Available casings are:

- `dot`: `my.file.name.js`
- `dash`: `my-file-name.js`
- `camel`: `myFileName.js`
- `snake`: `my_file_name.js`
- `pascal`: `MyFileName.js`
- `constant`: `MY_FILE_NAME.js`

When using an array of rules, at least one of the rules must apply, otherwise it fails the style check.

##### Valid object example

```json
{
  "angular": {
    "requireMatchingFilename": {
      "component": "pascal",
      "filename": "dash"
    }
  }
}
```

With a file named `assets/good-controller.js`:

```javascript
angular.module('app').controller('GoodController', function() {

})
```

##### Valid array example

You might use both pascal and camel casings in a project depending on the kind of module, then do it
like this:

```json
{
  "angular": {
    "requireMatchingFilename": [{
      "component": "camel",
      "filename": "camel"
    }, {
      "component": "pascal",
      "filename": "pascal"
    }]
  }
}
```

With a file named `assets/goodController.js`:

```javascript
angular.module('app').controller('goodController', function() {

})
```

##### Invalid example

```json
{
  "angular": {
    "requireMatchingFilename": true
  }
}
```
With a file named `assets/bad-controller.js`:

```javascript
angular.module('app').controller('BadController', function() {

})
```

## Browser support

This functionality have not been tested at all, since I personally have no need for it.
