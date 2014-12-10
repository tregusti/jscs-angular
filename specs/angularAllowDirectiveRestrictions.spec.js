'use strict';

var Checker = require('jscs/lib/checker');
var chai = require('chai');
var expect = chai.expect;
var format = require('util').format;

describe('angularAllowDirectiveRestrictions', function() {
  var checker;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(new (require('../src/rules/angularAllowDirectiveRestrictions.js'))());
  });

  describe('option validation with', function() {
    context('true', function() {
      function fn() {
        checker.configure({
          angularAllowDirectiveRestrictions: true
        });
      }
      it('warns about a bad value', function() {
        expect(fn).to.throw(/true/);
      });
      it('shows link to documentation', function() {
        expect(fn).to.throw(/github.*#angularallowdirectiverestrictions/);
      });
    });
    context('string', function() {
      it('allows E,C,M,A', function() {
        expect(function() {
          checker.configure({
            angularAllowDirectiveRestrictions: 'ECMA'
          });
        }).to.not.throw;
      });
      it('throws on bad values', function() {
        expect(function() {
          checker.configure({
            angularAllowDirectiveRestrictions: 'YMCA'
          });
        }).to.throw(/\bY\b/);
      });
    });
  });

  describe('when validating code', function() {
    beforeEach(function() {
      checker.configure({
        angularAllowDirectiveRestrictions: 'EA'
      });
    });
    context('with invalid restrictions', function() {
      var errors;
      beforeEach(function() {
        errors = errorsFor('EM');
      });
      it('gives an error', function() {
        expect(errors).to.have.length(1);
      });
      it('explains the voilation', function() {
        expect(errors[0]).to.have.property('message').that.match(/\bM\b/);
      });
      it('set the position to the bad restriction letter', function() {
        var col = template.indexOf('%s') + 2;
        expect(errors[0]).to.have.property('line', 1);
        expect(errors[0]).to.have.property('column', col);
      });
    });

    context('with valid restrictions', function() {
      it('gives no error', function() {
        checker.configure({
          angularAllowDirectiveRestrictions: 'EA'
        });
        var errors = errorsFor('AE');
        expect(errors).to.be.empty;
      });
    });

    context('when restrict value is not a string', function() {
      it('gives no error since we can not validate', function() {
        checker.configure({
          angularAllowDirectiveRestrictions: 'E'
        });
        var errors = errorsFor(null);
        expect(errors).to.be.empty;
      });
    });
  });

  var template = 'app.directive("thing", function() { return { restrict: %s }; })';

  function errorsFor(restrictions) {
    var source = format(template, JSON.stringify(restrictions));
    return checker.checkString(source).getErrorList();
  }
});
