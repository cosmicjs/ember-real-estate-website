import DS from 'ember-data';
import config from '../config/environment';
import Ember from 'ember';

var cosmic;
if (config.environment === "production") {
  Ember.$.ajax('/api', {
    data: {format: 'json'},
    async: false,
    success: function(data) {
      cosmic = {
        bucket: data.bucket,
        writeKey: data.writeKey,
        readKey: data.readKey
      }
    }
  });
} else {
  //config.environment === "development"
  cosmic = {
    bucket: 'cosmic-real-estate',
    writeKey: null,
    readKey: null
  }
}

export default DS.RESTAdapter.extend({
  host: 'https://api.cosmicjs.com/v1/' + cosmic.bucket,
  urlForFindAll(modelName) {
    let path = this.pathForType(modelName);
    return this.buildURL() + '/object-type/' + path;
  },
  urlForFindRecord(slug) {
    return this.buildURL() + '/object/' + slug;
  },
  urlForUpdateRecord() {
    return this.buildURL() + '/edit-object';
  },
  updateRecord: function(store, type, snapshot) {
    var data = {};
    var serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot);
    data = data.listing;
    var id = snapshot.id;
    var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

    return this.ajax(url, "PUT", { data: data });
  }
});
