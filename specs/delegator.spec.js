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

  context('bad option value', function () {
    function fn() {
      checker.configure({
        angular: true
      });
    }
    it('warns about a bad value', function () {
      expect(fn).to.throw(/must.*object/);
    });
    it('shows link to documentation', function () {
      expect(fn).to.throw(/github.*#usage/i);
    });
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
