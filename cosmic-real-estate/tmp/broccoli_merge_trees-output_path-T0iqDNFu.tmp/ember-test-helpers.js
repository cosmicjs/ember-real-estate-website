define('ember-test-helpers', ['exports', 'ember', 'ember-test-helpers/test-module', 'ember-test-helpers/test-module-for-acceptance', 'ember-test-helpers/test-module-for-integration', 'ember-test-helpers/test-module-for-component', 'ember-test-helpers/test-module-for-model', 'ember-test-helpers/test-context', 'ember-test-helpers/test-resolver'], function (exports, _ember, _testModule, _testModuleForAcceptance, _testModuleForIntegration, _testModuleForComponent, _testModuleForModel, _testContext, _testResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setResolver = exports.unsetContext = exports.setContext = exports.getContext = exports.TestModuleForModel = exports.TestModuleForComponent = exports.TestModuleForIntegration = exports.TestModuleForAcceptance = exports.TestModule = undefined;


  _ember.default.testing = true;

  exports.TestModule = _testModule.default;
  exports.TestModuleForAcceptance = _testModuleForAcceptance.default;
  exports.TestModuleForIntegration = _testModuleForIntegration.default;
  exports.TestModuleForComponent = _testModuleForComponent.default;
  exports.TestModuleForModel = _testModuleForModel.default;
  exports.getContext = _testContext.getContext;
  exports.setContext = _testContext.setContext;
  exports.unsetContext = _testContext.unsetContext;
  exports.setResolver = _testResolver.setResolver;
});