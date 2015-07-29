'use strict';

var type    = require('type-of');
var esprima = require('esprima');
var JsFile  = require('jscs/lib/js-file');
var expect  = require('chai').expect;

var dependencyExpression = require('../src/dependencyExpression');

describe('dependencyExpression', function() {
  var all;

  context('with a simple controller', function() {
    beforeEach(function() {
      var node = parse('angular.module("mod").controller("ctrl", function(a, b, c) {})');
      all = dependencyExpression.allFromNode(node);
    });
    it('only find one matching expression', function() {
      expect(all).to.have.length(1);
    });
    it('finds the FunctionExpression', function() {
      expect(all[0]).to.have.deep.property('expression.type', 'FunctionExpression');
    });
    it('finds the dependencies', function() {
      expect(all[0]).to.have.deep.property('expression.params[0].name', 'a');
      expect(all[0]).to.have.deep.property('expression.params[1].name', 'b');
      expect(all[0]).to.have.deep.property('expression.params[2].name', 'c');
    });
    it('specifies the angular type', function() {
      expect(all[0]).to.have.property('type', 'controller');
    });
    it('specifies the angular name', function() {
      expect(all[0]).to.have.property('name', 'ctrl');
    });
  });

  context('with a config block', function() {
    beforeEach(function() {
      var node = parse('angular.module("mod").config(function($q) {})');
      all = dependencyExpression.allFromNode(node);
    });
    it('only find one matching expression', function() {
      expect(all).to.have.length(1);
    });
    it('specifies the angular type', function() {
      expect(all[0]).to.have.property('type', 'config');
    });
    it('does not have a name property', function() {
      expect(all[0].name).to.be.null;
    });
  });

  context('with a ui-router resolve block', function() {
    beforeEach(function() {
      var node = parse('$stateProvider.state("state", { resolve: { func1: function(x, y) {} } })');
      all = dependencyExpression.allFromNode(node);
    });
    it('only find one matching expression', function() {
      expect(all).to.have.length(1);
    });
    it('specifies the angular type', function() {
      expect(all[0]).to.have.property('type', 'resolve');
    });
    it('specifies the angular name', function() {
      expect(all[0]).to.have.property('name', 'func1');
    });
  });

  context('with a ng-route resolve block', function() {
    beforeEach(function() {
      var node = parse('$routeProvider.when("/hello", { resolve: { func1: function(x, y) {} } })');
      all = dependencyExpression.allFromNode(node);
    });
    it('only find one matching expression', function() {
      expect(all).to.have.length(1);
    });
    it('specifies the angular type', function() {
      expect(all[0]).to.have.property('type', 'resolve');
    });
    it('specifies the angular name', function() {
      expect(all[0]).to.have.property('name', 'func1');
    });
  });
});

function parse(source) {
  if (type(JsFile.parse) === 'function') {
    // JSCS >1.5.9 <2.0.0
    var tree = JsFile.parse(source, esprima);
    return new JsFile('example.js', source, tree);
  } else {
    // JSCS >2.0.0
    return new JsFile({
      filename: 'example.js',
      source: source,
      esprima: esprima
    });
  }
}
