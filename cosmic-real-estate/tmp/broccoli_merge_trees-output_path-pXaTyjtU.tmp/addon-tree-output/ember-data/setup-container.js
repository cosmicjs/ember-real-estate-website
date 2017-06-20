define('ember-data/setup-container', ['exports', 'ember-data/-private/initializers/store', 'ember-data/-private/initializers/transforms', 'ember-data/-private/initializers/store-injections', 'ember-data/-private/initializers/data-adapter'], function (exports, _store, _transforms, _storeInjections, _dataAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = setupContainer;
  function setupContainer(application) {
    (0, _dataAdapter.default)(application);
    (0, _transforms.default)(application);
    (0, _storeInjections.default)(application);
    (0, _store.default)(application);
  }
});