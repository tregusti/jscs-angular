'use strict';

var Checker = require('jscs/lib/checker');
var chai = require('chai');
var expect = chai.expect;
var format = require('util').format;

describe('angularRequireMatchingFilename', function() {
  var checker;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(new (require('../../src/rules/angularRequireMatchingFilename.js'))());
  });

  context('set to camel', function() {
    beforeEach(function() {
      checker.configure({
        angularRequireMatchingFilename: 'camel'
      });
    });

    context('with mismatch', function() {
      it('has one error', function() {
        var errors = errorsFor('MyName', 'myName.js');
        expect(errors).to.have.length(1);
      });
      it('explains the violation', function() {
        var errors = errorsFor('MyName', 'myName.js');
        expect(errors[0]).to.have.property('message').that.match(/MyName.*not.*camel/);
      });
      it('has the correct position', function() {
        var errors = errorsFor('MiliamController', 'miliamController.js');
        expect(errors[0]).to.have.property('line', 2);
        expect(errors[0]).to.have.property('column', 13);
      });
    });

    context('with matching names', function() {
      it('has no errors', function() {
        var errors = errorsFor('myName', 'myName.js');
        expect(errors).to.be.empty;
      });
    });

    it('handles filenames with full path', function() {
      var errors = errorsFor('name', 'path/to/name.js');
      expect(errors).to.be.empty;
    });

    it('ignores code without a file name', function() {
      var errors = errorsFor('controller');
      expect(errors).to.be.empty;
    });
  });

  describe('bad option value', function() {
    context('strange string', function() {
      function fn() {
        checker.configure({
          angularRequireMatchingFilename: 'tregusti'
        });
      }
      it('warns about it', function() {
        expect(fn).to.throw(/tregusti/);
      });
      it('shows link to documentation', function() {
        expect(fn).to.throw(/github.*#angularrequirematchingfilename/i);
      });
    });
    it('gives an error when no filename for single rule', function() {
      expect(function() {
        checker.configure({
          angularRequireMatchingFilename: {
            component: 'pascal'
          }
        });
      }).to.throw(/filename/);
    });
    it('gives an error when no component for single rule', function() {
      expect(function() {
        checker.configure({
          angularRequireMatchingFilename: {
            filename: 'pascal'
          }
        });
      }).to.throw(/component/);
    });
    it('gives an error when no component for one of several rules', function() {
      expect(function() {
        checker.configure({
          angularRequireMatchingFilename: [{
            component: 'pascal',
            filename:  'camel'
          }, {
            filename: 'pascal'
          }]
        });
      }).to.throw(/component/);
    });
  });

  describe('casing validation', function() {
    ['dot', 'camel', 'snake', 'dash', 'pascal', 'constant'].forEach(function(casing) {
      it('does not throw for ' + casing, function() {
        expect(function() {
          checker.configure({
            angularRequireMatchingFilename: {
              filename: casing,
              component: casing
            }
          });
        }).to.not.throw;
      });
    });
    it('throws for unknown casing: param', function() {
      expect(function() {
        checker.configure({
          angularRequireMatchingFilename: {
            filename: 'param',
            component: 'param'
          }
        });
      }).to.throw(/param/);
    });
  });

  context('with ruling for camel cased file name and pascal cased component', function() {
    beforeEach(function() {
      checker.configure({
        angularRequireMatchingFilename: {
          filename: 'camel',
          component: 'pascal'
        }
      });
    });
    context('when file name is not matching', function() {
      var errors;
      beforeEach(function() {
        errors = errorsFor('SomeName', 'SomeName.js');
      });
      it('gives an error', function() {
        expect(errors).to.have.length(1);
      });
      it('explains the violation', function() {
        expect(errors[0]).to.have.property('message').that.match(/[Ff]ile.*SomeName\.js.*not.*camel/);
      });
      it('has position set to beginning of file', function() {
        expect(errors[0]).to.have.property('line', 1);
        expect(errors[0]).to.have.property('column', 0);
      });
    });
    context('when component name is not matching', function() {
      var errors;
      beforeEach(function() {
        errors = errorsFor('someName', 'someName.js');
      });
      it('gives an error', function() {
        expect(errors).to.have.length(1);
      });
      it('explains the violation', function() {
        expect(errors[0]).to.have.property('message').that.match(/[Cc]omponent.*someName.*not.*pascal/);
      });
      it('has position set correctly', function() {
        var col = '.controller("'.length;
        expect(errors[0]).to.have.property('line', 2);
        expect(errors[0]).to.have.property('column', col);
      });
    });
  });

  describe('enforced camel casing for directives', function() {
    beforeEach(function() {
      checker.configure({
        angularRequireMatchingFilename: 'pascal'
      });
    });
    it('allows exceptions from the rule', function() {
      var errors = errorsFor('someName', 'SomeName.js', 'directive');
      expect(errors).to.have.length(0);
    });
  });

  context('with ruling for dash cased file name and camel cased component', function() {
    beforeEach(function() {
      checker.configure({
        angularRequireMatchingFilename: {
          filename: 'dash',
          component: 'camel'
        }
      });
    });
    context('when file name is not matching', function() {
      it('explains the violation', function() {
        var errors = errorsFor('someName', 'someName.js');
        expect(errors[0]).to.have.property('message').that.match(/[Ff]ile.*someName\.js.*not.*dash/);
      });
    });
    context('when component name is not matching', function() {
      it('explains the violation', function() {
        var errors = errorsFor('SomeName', 'some-name.js');
        expect(errors[0]).to.have.property('message').that.match(/[Cc]omponent.*SomeName.*not.*camel/);
      });
    });
  });

  context('with multiple rules', function() {
    beforeEach(function() {
      checker.configure({
        angularRequireMatchingFilename: [{
          component: 'pascal',
          filename:  'pascal'
        }, {
          filename:  'snake',
          component: 'camel'
        }]
      });
    });
    it('gives one error for each rule in a list', function() {
      var errors = errorsFor('someName', 'SomeName.js');
      expect(errors).to.have.length(2);
    });
    it('does not give an error when one rule is fulfilled', function() {
      var errors = errorsFor('SomeName', 'SomeName.js');
      expect(errors).to.be.empty;
    });
    it('does not give an error when the second rule is fulfilled', function() {
      // Ensure issue #12 doesn't happen again.
      var errors = errorsFor('someName', 'some_name.js');
      expect(errors).to.be.empty;
    });
  });

  function errorsFor(name, filename, componentType) {
    componentType = componentType || 'controller';
    var source = 'angular.module("mod")\n.%s("%s", function() {})';
    source = format(source, componentType, name);
    return checker.checkString(source, filename).getErrorList();
  }
});
