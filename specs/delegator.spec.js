'use strict';

var Checker = require('jscs/lib/checker');
var chai = require('chai');
var expect = chai.expect;

describe('delegator', function () {
  var checker;

  beforeEach(function () {
    checker = new Checker();
    checker.registerRule(new (require('../src/rules/delegator.js'))());
  });

  it('does not invoke non configured rules', function () {
    configure({
      requireAngularDependencyOrder: 'first'
    });

    var source = 'angular.module("m").controller("Abc", function() {})';
    var errors = errorsFor(source, 'file.js');
    expect(errors).to.be.empty;
  });

  function errorsFor(source, filename) {
    return checker.checkString(source, filename).getErrorList();
  }

  function configure(options) {
    checker.configure({
      angular: options
    });
  }
});
