'use strict';

var Checker = require('jscs/lib/checker');
var chai = require('chai');
var expect = chai.expect;
var util = require('util');

describe('requireAngularDependencyOrder', function() {
  var checker, errors;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(new (require('../src/rules/delegator.js'))());
  });

  var configs = [{
    title: 'controllers',
    method: 'controller',
    template: 'angular.module("m").controller("c", function(%s) {});'
  }, {
    title: 'services',
    method: 'service',
    template: 'angular.module("m").service("s", function(%s) {});'
  }, {
    title: 'factories',
    method: 'factory',
    template: 'angular.module("m").factory("f", function(%s) {});'
  }, {
    title: 'directives',
    method: 'directive',
    template: 'angular.module("m").directive("p", function(%s) {});'
  }, {
    title: 'providers',
    method: 'provider',
    template: 'angular.module("m").provider("p", function(%s) {});'
  }, {
    title: 'configurations',
    method: 'config',
    template: 'angular.module("m").config("c", function(%s) {});'
  }];

  context('when set to first', function() {
    beforeEach(function() {
      configure({
        requireAngularDependencyOrder: 'first'
      });
    });

    configs.forEach(function(item) {

      describe(item.title, function() {
        var errorsForDependencies = errorsForTemplate.bind(null, item.template);

        context('with bad order', function() {
          beforeEach(function() {
            errors = errorsForDependencies('dep, $dep');
          });
          it('has one error', function() {
            expect(errors).to.have.length(1);
          });
          it('explains the violation', function() {
            expect(errors[0]).to.have.property('message').that.match(/\$dep.*before.*dep/);
          });
        });

        context('with correct order', function() {
          beforeEach(function() {
            errors = errorsForDependencies('$dep, dep');
          });
          it('has no errors', function() {
            expect(errors).to.be.empty;
          });
        });
      });
    });
  });

  context('when set to last', function() {
    beforeEach(function() {
      configure({
        requireAngularDependencyOrder: 'last'
      });
    });

    configs.forEach(function(item) {

      describe(item.title, function() {
        var errorsForDependencies = errorsForTemplate.bind(null, item.template);

        context('with bad order', function() {
          beforeEach(function() {
            errors = errorsForDependencies('$dep, dep');
          });
          it('has one error', function() {
            expect(errors).to.have.length(1);
          });
          it('explains the violation', function() {
            expect(errors[0]).to.have.property('message').that.match(/dep.*after.*\$dep/);
          });
        });

        context('with correct order', function() {
          beforeEach(function() {
            errors = errorsForDependencies('dep, $dep');
          });
          it('has no errors', function() {
            expect(errors).to.be.empty;
          });
        });
      });
    });
  });

  context('bad option value', function() {
    function fn() {
      configure({
        requireAngularDependencyOrder: 'wrong'
      });
    }
    it('warns about a bad value', function() {
      expect(fn).to.throw(/wrong/);
    });
    it('shows link to documentation', function() {
      expect(fn).to.throw(/github.*#requireangulardependencyorder/i);
    });
  });


  function errorsForTemplate(template, vars) {
    var source = util.format.apply(null, [template].concat(vars));
    return checker.checkString(source).getErrorList();
  }

  function configure(options) {
    checker.configure({
      angular: options
    });
  }
});
