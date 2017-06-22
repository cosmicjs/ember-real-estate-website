define('ember-qunit', ['exports', 'qunit', 'ember-qunit/module-for', 'ember-qunit/module-for-component', 'ember-qunit/module-for-model', 'ember-qunit/adapter', 'ember-test-helpers'], function (exports, _qunit, _moduleFor, _moduleForComponent, _moduleForModel, _adapter, _emberTestHelpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.QUnitAdapter = exports.setResolver = exports.moduleForModel = exports.moduleForComponent = exports.moduleFor = exports.todo = exports.only = exports.skip = exports.test = exports.module = undefined;
  Object.defineProperty(exports, 'module', {
    enumerable: true,
    get: function () {
      return _qunit.module;
    }
  });
  Object.defineProperty(exports, 'test', {
    enumerable: true,
    get: function () {
      return _qunit.test;
    }
  });
  Object.defineProperty(exports, 'skip', {
    enumerable: true,
    get: function () {
      return _qunit.skip;
    }
  });
  Object.defineProperty(exports, 'only', {
    enumerable: true,
    get: function () {
      return _qunit.only;
    }
  });
  Object.defineProperty(exports, 'todo', {
    enumerable: true,
    get: function () {
      return _qunit.todo;
    }
  });
  exports.moduleFor = _moduleFor.default;
  exports.moduleForComponent = _moduleForComponent.default;
  exports.moduleForModel = _moduleForModel.default;
  exports.setResolver = _emberTestHelpers.setResolver;
  exports.QUnitAdapter = _adapter.default;
});