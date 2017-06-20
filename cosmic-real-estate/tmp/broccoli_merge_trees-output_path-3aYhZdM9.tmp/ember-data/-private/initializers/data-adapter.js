define("ember-data/-private/initializers/data-adapter", ["exports", "ember-data/-private/system/debug/debug-adapter"], function (exports, _debugAdapter) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = initializeDebugAdapter;


  /*
    Configures a registry with injections on Ember applications
    for the Ember-Data store. Accepts an optional namespace argument.
  
    @method initializeDebugAdapter
    @param {Ember.Registry} registry
  */
  function initializeDebugAdapter(registry) {
    registry.register('data-adapter:main', _debugAdapter.default);
  }
});