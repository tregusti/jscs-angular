'use strict';

var Checker = require('jscs/lib/checker');
var chai = require('chai');
var expect = chai.expect;
var vsprintf = require('sprintf-js').vsprintf;

describe('angularRequireDependencyOrder', function() {
  var checker, errors;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(new (require('../../src/rules/angularRequireDependencyOrder.js'))());
  });

  var configs = [{
    title: 'controllers in function syntax',
    method: 'controller',
    template: 'angular.module("m").controller("c", function(%s, %s) {});'
  }, {
    title: 'controllers in array syntax',
    method: 'controller',
    template: 'angular.module("m").controller("c", ["%1$s", "%2$s", function(%1$s, %2$s) {}]);'
  }, {
    title: 'services in function syntax',
    method: 'service',
    template: 'angular.module("m").service("s", function(%s, %s) {});'
  }, {
    title: 'services in array syntax',
    method: 'service',
    template: 'angular.module("m").service("s", ["%1$s", "%2$s", function(%1$s, %2$s) {}]);'
  }, {
    title: 'factories in function syntax',
    method: 'factory',
    template: 'angular.module("m").factory("f", function(%s, %s) {});'
  }, {
    title: 'factories in array syntax',
    method: 'factory',
    template: 'angular.module("m").factory("f", ["%1$s", "%2$s", function(%1$s, %2$s) {}]);'
  }, {
    title: 'directives in function syntax',
    method: 'directive',
    template: 'angular.module("m").directive("p", function(%s, %s) {});'
  }, {
    title: 'directives in array syntax',
    method: 'directive',
    template: 'angular.module("m").directive("p", ["%1$s", "%2$s", function(%1$s, %2$s) {}]);'
  }, {
    title: 'providers in function syntax',
    method: 'provider',
    template: 'angular.module("m").provider("p", function(%s, %s) {});'
  }, {
    title: 'providers in array syntax',
    method: 'provider',
    template: 'angular.module("m").provider("p", ["%1$s", "%2$s", function(%1$s, %2$s) {}]);'
  }, {
    title: 'configurations in function syntax',
    method: 'config',
    template: 'angular.module("m").config(function(%s, %s) {});'
  }, {
    title: 'configurations in array syntax',
    method: 'config',
    template: 'angular.module("m").config(["%1$s", "%2$s", function(%1$s, %2$s) {}]);'
  }];

  context('when set to first', function() {
    beforeEach(function() {
      checker.configure({
        angularRequireDependencyOrder: 'first'
      });
    });

    configs.forEach(function(item) {

      describe(item.title, function() {
        var errorsForDependencies = errorsForTemplate.bind(null, item.template);

        context('with bad order', function() {
          beforeEach(function() {
            errors = errorsForDependencies('dep', '$dep');
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
            errors = errorsForDependencies('$dep', 'dep');
          });
          it('has no errors', function() {
            expect(errors).to.be.empty;
          });
        });
      });
    });

    describe('ui-router resolve objects', function() {
      context('with function syntax', function() {
        var template = '$stateProvider.state("name", { resolve: { prop: function(%s, %s) {} } })';
        var errorsForDependencies = errorsForTemplate.bind(null, template);

        context('with bad order', function() {
          it('has one error', function() {
            errors = errorsForDependencies('dep', '$dep');
            expect(errors).to.have.length(1);
          });
        });

        context('with many resolve functions', function() {
          it('checks all of them', function() {
            // jshint multistr:true
            var template = '\
              $stateProvider.state("name", {\
                resolve: {\
                  prop1: function(%s, %s) {},\
                  prop2: function(%s, %s) {},\
                }\
              })\
            ';
            errors = errorsForTemplate(template, 'bad1', '$bad2', 'bad3', '$bad4');
            expect(errors).to.have.length(2);
          });
        });

        context('with correct order', function() {
          it('has no errors', function() {
            errors = errorsForDependencies('$dep', 'dep');
            expect(errors).to.be.empty;
          });
        });
      });

      context('with array syntax', function() {
        // jshint multistr:true
        var template = '\
          $stateProvider.state("name", {\
            resolve: { prop: ["%1$s", "%2$s", function(%1$s, %2$s) {}] }\
          })\
        ';
        var errorsForDependencies = errorsForTemplate.bind(null, template);

        context('with bad order', function() {
          it('has one error', function() {
            errors = errorsForDependencies('dep', '$dep');
            expect(errors).to.have.length(1);
          });
          it('has the correct position', function() {
            errors = errorsForDependencies('dep', '$dep');
            var col = template.indexOf(', "') + 2;
            expect(errors[0]).to.have.property('line', 1);
            expect(errors[0]).to.have.property('column', col);
          });
        });

        context('with many resolve functions', function() {
          it('checks all of them', function() {
            var template = '\
              $stateProvider.state("name", {\
                resolve: {\
                  prop1: ["%1$s", "%2$s", function(%1$s, %2$s) {}],\
                  prop2: ["%3$s", "%4$s", function(%3$s, %4$s) {}],\
                }\
              })\
            ';
            errors = errorsForTemplate(template, 'bad1', '$bad2', 'bad3', '$bad4');
            expect(errors).to.have.length(2);
          });
        });

        context('with correct order', function() {
          it('has no errors', function() {
            errors = errorsForDependencies('$dep', 'dep');
            expect(errors).to.be.empty;
          });
        });
      });

      context('with multiple states (bug #18)', function() {
        // https://github.com/tregusti/jscs-angular/issues/18
        var template = '$stateProvider' +
        '  .state("state1", {' +
        '    resolve: {' +
        '      func1: function (a, b, c, d, $http) {},' +
        '      func2: function (e, f, g, h, $injector) {}' +
        '    }' +
        '  })' +
        '  .state("state2", {' +
        '    resolve: {' +
        '      func: function (foo, bar, baz, $q, $route) {}' +
        '    }' +
        '  })';
        it('finds all offending dependencies', function() {
          var errors = errorsForTemplate(template);
          expect(errors).to.have.length(4);
        });
      });
    });

    describe('ng-route resolve objects', function() {
      context('with function syntax', function() {
        var template = '$routeProvider.when("/url", { resolve: { prop: function(%s, %s) {} } })';
        var errorsForDependencies = errorsForTemplate.bind(null, template);

        context('with bad order', function() {
          it('has one error', function() {
            errors = errorsForDependencies('dep', '$dep');
            expect(errors).to.have.length(1);
          });
        });

        context('with many resolve functions', function() {
          it('checks all of them', function() {
            // jshint multistr:true
            var template = '\
              $routeProvider.when("/url", {\
                resolve: {\
                  prop1: function(%s, %s) {},\
                  prop2: function(%s, %s) {},\
                }\
              })\
            ';
            errors = errorsForTemplate(template, 'bad1', '$bad2', 'bad3', '$bad4');
            expect(errors).to.have.length(2);
          });
        });

        context('with correct order', function() {
          it('has no errors', function() {
            errors = errorsForDependencies('$dep', 'dep');
            expect(errors).to.be.empty;
          });
        });
      });

      context('with array syntax', function() {
        // jshint multistr:true
        var template = '\
          $routeProvider.when("/url", {\
            resolve: { prop: ["%1$s", "%2$s", function(%1$s, %2$s) {}] }\
          })\
        ';
        var errorsForDependencies = errorsForTemplate.bind(null, template);

        context('with bad order', function() {
          it('has one error', function() {
            errors = errorsForDependencies('dep', '$dep');
            expect(errors).to.have.length(1);
          });
          it('has the correct position', function() {
            errors = errorsForDependencies('dep', '$dep');
            var col = template.indexOf(', "') + 2;
            expect(errors[0]).to.have.property('line', 1);
            expect(errors[0]).to.have.property('column', col);
          });
        });

        context('with many resolve functions', function() {
          it('checks all of them', function() {
            var template = '\
              $routeProvider.when("/url", {\
                resolve: {\
                  prop1: ["%1$s", "%2$s", function(%1$s, %2$s) {}],\
                  prop2: ["%3$s", "%4$s", function(%3$s, %4$s) {}],\
                }\
              })\
            ';
            errors = errorsForTemplate(template, 'bad1', '$bad2', 'bad3', '$bad4');
            expect(errors).to.have.length(2);
          });
        });

        context('with correct order', function() {
          it('has no errors', function() {
            errors = errorsForDependencies('$dep', 'dep');
            expect(errors).to.be.empty;
          });
        });
      });

      context('with multiple states (bug #18)', function() {
        // https://github.com/tregusti/jscs-angular/issues/18
        var template = '$routeProvider' +
        '  .when("/route1", {' +
        '    resolve: {' +
        '      func1: function (a, b, c, d, $http) {},' +
        '      func2: function (e, f, g, h, $injector) {}' +
        '    }' +
        '  })' +
        '  .when("/route2", {' +
        '    resolve: {' +
        '      func: function (foo, bar, baz, $q, $stateParams) {}' +
        '    }' +
        '  })';
        it('finds all offending dependencies', function() {
          var errors = errorsForTemplate(template);
          expect(errors).to.have.length(4);
        });
      });
    });

    describe('reproduction of issue #21', function() {
      it('should not crash when config argument is a named function variable', function() {
        var template = 'function config() {}; angular.module("mod").config(config);';
        errors = errorsForTemplate(template);
        expect(errors).to.be.empty;
      });
      it('handles a .provider access without invocation', function() {
        var template = 'var hello = { provider: 1 }; var t = hello.provider;';
        errors = errorsForTemplate(template);
        expect(errors).to.be.empty;
      });
    });

  });

  context('when set to last', function() {
    beforeEach(function() {
      checker.configure({
        angularRequireDependencyOrder: 'last'
      });
    });

    configs.forEach(function(item) {

      describe(item.title, function() {
        var errorsForDependencies = errorsForTemplate.bind(null, item.template);

        context('with bad order', function() {
          beforeEach(function() {
            errors = errorsForDependencies('$dep', 'dep');
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
            errors = errorsForDependencies('dep', '$dep');
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
      checker.configure({
        angularRequireDependencyOrder: 'wrong'
      });
    }
    it('warns about a bad value', function() {
      expect(fn).to.throw(/wrong/);
    });
    it('shows link to documentation', function() {
      expect(fn).to.throw(/github.*#angularrequiredependencyorder/i);
    });
  });

  it('handles components', function() {
    checker.configure({
      angularRequireDependencyOrder: 'first'
    });
    var template = 'angular.module("m").component("c", {});';
    var errors = errorsForTemplate(template);
    expect(errors).to.be.empty;
  });

  function errorsForTemplate(template) {
    var source = vsprintf(template, [].slice.call(arguments, 1));
    return checker.checkString(source).getErrorList();
  }
});
