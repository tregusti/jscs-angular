'use strict';

var Checker = require('jscs/lib/checker');
var chai = require('chai');
var expect = chai.expect;
var format = require('util').format;

describe('angularAllowDirectiveRestrictions', function() {
  var checker;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(new (require('../../src/rules/angularAllowDirectiveRestrictions.js'))());
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
        errors = errorsForRestrictions('EM');
      });
      it('gives an error', function() {
        expect(errors).to.have.length(1);
      });
      it('explains the voilation', function() {
        expect(errors[0]).to.have.property('message').that.match(/\bM\b/);
      });
      it('set the position to the bad restriction letter', function() {
        var col = templateWithRestrictions.indexOf('%s') + 2;
        expect(errors[0]).to.have.property('line', 1);
        expect(errors[0]).to.have.property('column', col);
      });
    });

    context('with valid restrictions', function() {
      it('gives no error', function() {
        checker.configure({
          angularAllowDirectiveRestrictions: 'EA'
        });
        var errors = errorsForRestrictions('AE');
        expect(errors).to.be.empty;
      });
    });

    context('when restrict value is not a string', function() {
      it('gives no error since we can not validate', function() {
        checker.configure({
          angularAllowDirectiveRestrictions: 'E'
        });
        var errors = errorsForRestrictions(null);
        expect(errors).to.be.empty;
      });
    });

    context('when restrict is not present', function() {
      it('gives no error since we can not validate', function() {
        checker.configure({
          angularAllowDirectiveRestrictions: 'E'
        });
        var errors = errorsWithTemplate('app.directive("thing", function() { return {}; })');
        expect(errors).to.be.empty;
      });
    });
  });

  var templateWithRestrictions = 'app.directive("thing", function() { return { restrict: %s }; })';

  function errorsForRestrictions(restrictions) {
    var source = format(templateWithRestrictions, JSON.stringify(restrictions));
    return checker.checkString(source).getErrorList();
  }

  function errorsWithTemplate(template) {
    var source = format(template);
    return checker.checkString(source).getErrorList();
  }
});
