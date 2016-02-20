# jscs-angular

[![Version][version-image]][version-link]
[![Build Status][build-image]][build-link]
[![Dependency Status][dep-image]][dep-link]
[![devDependency Status][devdep-image]][devdep-link]
[![peerDependency Status][peerdep-image]][peerdep-link]

  [version-image]: http://img.shields.io/npm/v/jscs-angular.svg
  [version-link]:  https://www.npmjs.org/package/jscs-angular
  [build-image]:   https://img.shields.io/circleci/project/tregusti/jscs-angular/master.svg
  [build-link]:    https://circleci.com/gh/tregusti/jscs-angular
  [dep-image]:     https://david-dm.org/tregusti/jscs-angular.svg?theme=shields.io
  [dep-link]:      https://david-dm.org/tregusti/jscs-angular
  [devdep-image]:  https://david-dm.org/tregusti/jscs-angular/dev-status.svg?theme=shields.io
  [devdep-link]:   https://david-dm.org/tregusti/jscs-angular#info=devDependencies
  [peerdep-image]: https://david-dm.org/tregusti/jscs-angular/peer-status.svg
  [peerdep-link]:  https://david-dm.org/tregusti/jscs-angular#info=peerDependencies

[AngularJS](https://angularjs.org/) plugin for [JSCS](https://github.com/jscs-dev/node-jscs).

## Plugin installation

`jscs-angular` can be installed using `npm`:

    npm install jscs-angular

## Usage

To use this plugin you should add it to your configuration file, e.g. `.jscsrc`:

```json
{
  "plugins": ["jscs-angular"]
}
```

If you are using a JSCS version below `1.8` please use the old way of including the rules:

```json
{
  "additionalRules": [
    "node_modules/jscs-angular/src/rules/*.js"
  ]
}
```

## Configuration options

After including the additional rules above, you can use these options:

* [`angularAllowDirectiveRestrictions`](docs/angularAllowDirectiveRestrictions.md)
* [`angularRequireDependencyOrder`](docs/angularRequireDependencyOrder.md)
* [`angularRequireNameCase`](docs/angularRequireNameCase.md)
* [`angularVerifyDependencyUsage`](docs/angularVerifyDependencyUsage.md)

## Browser support

This functionality have not been tested at all, since I personally have no need for it.

## Thank you

[![Gratipay](http://img.shields.io/gratipay/tregusti.svg)](https://gratipay.com/tregusti/)
[![Flattr](http://img.shields.io/badge/flattr-donate-brightgreen.svg)](https://flattr.com/profile/tregusti)

Building good software and tools takes time. Please do support a future for this project if you are
using it. Thank you!
