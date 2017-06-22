define('cosmic-real-estate/adapters/listing', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.RESTAdapter.extend({
    host: 'https://api.cosmicjs.com/v1/cosmic-real-estate',
    urlForFindAll: function urlForFindAll(modelName, snapshot) {
      var path = this.pathForType(modelName);
      return this.buildURL() + '/object-type/' + path;
    },
    urlForFindRecord: function urlForFindRecord(slug) {
      return this.buildURL() + '/object/' + slug;
    }
  });
});