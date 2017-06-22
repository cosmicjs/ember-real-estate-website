define('cosmic-real-estate/adapters/listing', ['exports', 'ember-data', 'cosmic-real-estate/config/environment'], function (exports, _emberData, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  console.log(_environment.default);

  exports.default = _emberData.default.RESTAdapter.extend({
    host: 'https://api.cosmicjs.com/v1/' + _environment.default.cosmic.cosmicBucket,
    urlForFindAll: function urlForFindAll(modelName, snapshot) {
      var path = this.pathForType(modelName);
      return this.buildURL() + '/object-type/' + path;
    },
    urlForFindRecord: function urlForFindRecord(slug) {
      return this.buildURL() + '/object/' + slug;
    },
    urlForUpdateRecord: function urlForUpdateRecord() {
      return this.buildURL() + '/edit-object';
    },

    updateRecord: function updateRecord(store, type, snapshot) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(data, type, snapshot);
      data = data.listing;
      var id = snapshot.id;
      var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

      return this.ajax(url, "PUT", { data: data });
    }
  });
});