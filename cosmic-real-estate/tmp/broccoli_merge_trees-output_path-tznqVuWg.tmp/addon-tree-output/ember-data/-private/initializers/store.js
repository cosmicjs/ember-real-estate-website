define("ember-data/-private/initializers/store", ["exports", "ember-data/-private/system/store", "ember-data/-private/serializers", "ember-data/-private/adapters"], function (exports, _store, _serializers, _adapters) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = initializeStore;


  function has(applicationOrRegistry, fullName) {
    if (applicationOrRegistry.has) {
      // < 2.1.0
      return applicationOrRegistry.has(fullName);
    } else {
      // 2.1.0+
      return applicationOrRegistry.hasRegistration(fullName);
    }
  }

  /*
    Configures a registry for use with an Ember-Data
    store. Accepts an optional namespace argument.
  
    @method initializeStore
    @param {Ember.Registry} registry
  */
  function initializeStore(registry) {
    // registry.optionsForType for Ember < 2.1.0
    // application.registerOptionsForType for Ember 2.1.0+
    var registerOptionsForType = registry.registerOptionsForType || registry.optionsForType;
    registerOptionsForType.call(registry, 'serializer', { singleton: false });
    registerOptionsForType.call(registry, 'adapter', { singleton: false });

    registry.register('serializer:-default', _serializers.JSONSerializer);
    registry.register('serializer:-rest', _serializers.RESTSerializer);
    registry.register('adapter:-rest', _adapters.RESTAdapter);

    registry.register('adapter:-json-api', _adapters.JSONAPIAdapter);
    registry.register('serializer:-json-api', _serializers.JSONAPISerializer);

    if (!has(registry, 'service:store')) {
      registry.register('service:store', _store.default);
    }
  }
});