'use strict';

var Checker = require('jscs/lib/checker');
var chai = require('chai');
var expect = chai.expect;
var format = require('util').format;

describe('requireMatchingFilename', function() {
  var checker;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(new (require('../src/rules/delegator.js'))());
  });

  context('with requireMatchingFilename set to true', function() {
    beforeEach(function() {
      configure({
        requireMatchingFilename: true
      });
    });

    context('with mismatch', function() {
      it('has one error', function() {
        var errors = errorsFor('MyName', 'myName.js');
        expect(errors).to.have.length(1);
      });
      it('explains the violation', function() {
        var errors = errorsFor('MyName', 'myName.js');
        expect(errors[0]).to.have.property('message').that.match(/MyName.*not matching.*myName\.js/);
      });
      it('has the correct position', function() {
        var errors = errorsFor('MiliamController', 'filename.js');
        expect(errors[0]).to.have.property('line', 2);
        expect(errors[0]).to.have.property('column', 12);
      });
    });

    context('with matching names', function() {
      it('has no errors', function() {
        var errors = errorsFor('MyName', 'MyName.js');
        expect(errors).to.be.empty;
      });
    });

    it('handles filenames with full path', function() {
      var errors = errorsFor('Name', 'path/to/Name.js');
      expect(errors).to.be.empty;
    });

    it('ignores code without a file name', function() {
      var errors = errorsFor('Controller');
      expect(errors).to.be.empty;
    });
  });

  context('bad option value', function() {
    function fn() {
      configure({
        requireMatchingFilename: null
      });
    }
    it('warns about a bad value', function() {
      expect(fn).to.throw(/null/);
    });
    it('shows link to documentation', function() {
      expect(fn).to.throw(/github.*#requirematchingfilename/i);
    });
  });



  context('with ruling for camel cased file name and pascal cased component', function() {
    beforeEach(function() {
      configure({
        requireMatchingFilename: {
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

  context('with ruling for snake cased file name and camel cased component', function() {
    beforeEach(function() {
      configure({
        requireMatchingFilename: {
          filename: 'snake',
          component: 'camel'
        }
      });
    });
    context('when file name is not matching', function() {
      it('explains the violation', function() {
        var errors = errorsFor('someName', 'someName.js');
        expect(errors[0]).to.have.property('message').that.match(/[Ff]ile.*someName\.js.*not.*snake/);
      });
    });
    context('when component name is not matching', function() {
      it('explains the violation', function() {
        var errors = errorsFor('SomeName', 'some_name.js');
        expect(errors[0]).to.have.property('message').that.match(/[Cc]omponent.*SomeName.*not.*camel/);
      });
    });
  });

  it('validates the option for single rule');
  it('validates the option for an array of rules');
  it('validates the option a true value');

  function errorsFor(name, filename) {
    var source = 'angular.module("mod")\n.controller("%s", function() {})';
    source = format(source, name);
    return checker.checkString(source, filename).getErrorList();
  }

  function configure(options) {
    checker.configure({
      angular: options
    });
  }
});
