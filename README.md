# jscs-angular

[![Version](http://img.shields.io/npm/v/jscs-angular.svg)](https://www.npmjs.org/package/jscs-angular)
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

* [`allowDirectiveRestrictions`](docs/allowDirectiveRestrictions.md)
* [`requireAngularDependencyOrder`](docs/requireAngularDependencyOrder.md)
* [`requireMatchingFilename`](docs/requireMatchingFilename.md)

## Browser support

This functionality have not been tested at all, since I personally have no need for it.

## Thank you

[![Gratipay](http://img.shields.io/gratipay/tregusti.svg)](https://gratipay.com/tregusti/)
[![Flattr](http://img.shields.io/badge/flattr-donate-brightgreen.svg)](https://flattr.com/profile/tregusti)

Building good software and tools takes time. Please do support a future for this project if you are
using it. Thank you!
