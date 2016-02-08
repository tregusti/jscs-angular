'use strict';

var Checker = require('jscs/lib/checker');
var expect = require('chai').expect;
var vsprintf = require('sprintf-js').vsprintf;

describe('angularVerifyDependencyUsage', function() {
  var checker, errors;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(new (require('../../src/rules/angularVerifyDependencyUsage.js'))());
  });

  context('bad option value', function() {
    function fn() {
      checker.configure({
        angularVerifyDependencyUsage: 'wrong'
      });
    }
    it('warns about a bad value', function() {
      expect(fn).to.throw(/wrong/);
    });
    it('shows link to documentation', function() {
      expect(fn).to.throw(/github.*#angularverifydependencyusage/i);
    });
  });


  context('when not enabled', function() {
    beforeEach(function() {
      checker.configure({
        angularVerifyDependencyUsage: false
      });
    });
    it('generates no errors for unused dependency', function() {
      var errors = errorsForTemplate('angular.module("a").config(function(b) {})');
      expect(errors).to.be.empty;
    });
  });

  context('when enabled', function() {
    beforeEach(function() {
      checker.configure({
        angularVerifyDependencyUsage: true
      });
    });

    context('with unused dependency', function() {
      beforeEach(function() {
        errors = errorsForTemplate('angular.module("a").config(function(alpha) {})');
      });
      it('has one error', function() {
        expect(errors).to.have.length(1);
      });
      it('explains the violation', function() {
        expect(errors[0]).to.have.property('message').that.match(/alpha.*not.*use/);
      });
    });

    context('with unused dependency in array expression', function() {
      beforeEach(function() {
        errors = errorsForTemplate('angular.module("a").config(["alpha", function(alpha) {}])');
      });
      it('has one error', function() {
        expect(errors).to.have.length(1);
      });
      it('explains the violation', function() {
        expect(errors[0]).to.have.property('message').that.match(/alpha.*not.*use/);
      });
    });

    context('with used dependencies (Implicit Annotation)', function() {
      beforeEach(function() {
        errors = errorsForTemplate('' +
          'angular.module("a").service("S", function(alpha, beta) {' +
          '  alpha.hepp(beta);' +
          '})');
      });
      it('has no errors', function() {
        expect(errors).to.be.empty;
      });
    });

    context('with used dependencies (Inline Array Annotation)', function() {
      beforeEach(function() {
        errors = errorsForTemplate('' +
          'angular.module("a").service("S", ["alpha", "beta", function(alpha, beta) {' +
          '  alpha.hepp(beta);' +
          '}])');
      });
      it('has no errors', function() {
        expect(errors).to.be.empty;
      });
    });

    context('with used dependencies (Renamed Inline Array Annotation)', function() {
      beforeEach(function() {
        errors = errorsForTemplate('' +
          'angular.module("a").service("S", ["myAlpha", "myBeta", function(alpha, beta) {' +
          '  alpha.hepp(beta);' +
          '}])');
      });
      it('has no errors', function() {
        expect(errors).to.be.empty;
      });
    });
  });

  function errorsForTemplate(template) {
    var source = vsprintf(template, [].slice.call(arguments, 1));
    return checker.checkString(source).getErrorList();
  }
});
