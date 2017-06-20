define('cosmic-real-estate/adapters/listing', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.RESTAdapter.extend({
    host: 'https://api.cosmicjs.com/v1/cosmic-real-estate',
    namespace: 'object-type',
    pathForType: function pathForType(modelName) {
      modelName = Ember.String.pluralize(modelName);
      return modelName.concat("?hide_metafields=true");
    }
  });
});