define('ember-qunit/module-for', ['exports', 'ember-qunit/qunit-module', 'ember-test-helpers'], function (exports, _qunitModule, _emberTestHelpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = moduleFor;
  function moduleFor(name, description, callbacks) {
    (0, _qunitModule.createModule)(_emberTestHelpers.TestModule, name, description, callbacks);
  }
});