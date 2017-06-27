import DS from 'ember-data';
import config from '../config/environment';
import Ember from 'ember';

function getKeys() {
  var cosmicJs;
  if (config.environment === "production") {
    Ember.$.ajax('/api', {
      data: {format: 'json'},
      async: false,
      success: function(data) {
        cosmicJs = {
          bucket: data.bucket,
          writeKey: data.writeKey,
          readKey: data.readKey
        };
      }
    });
  } else {
    //config.environment === "development"
    cosmicJs = {
      bucket: 'cosmic-real-estate',
      writeKey: null,
      readKey: null
    };
  }
  return cosmicJs;
}

var cosmic = getKeys();

function urlWithReadKey(endpoint) {
  return endpoint + '?read_key=' + cosmic.readKey;
}

export {getKeys};

export default DS.RESTAdapter.extend({
  host: 'https://api.cosmicjs.com/v1/' + cosmic.bucket,
  urlForFindAll(modelName) {
    let path = this.pathForType(modelName);
    let endpoint = this.buildURL() + '/object-type/' + path;
    return cosmic.readKey ? urlWithReadKey(endpoint) : endpoint;
  },
  urlForFindRecord(slug) {
    let endpoint = this.buildURL() + '/object/' + slug;
    return cosmic.readKey ? urlWithReadKey(endpoint) : endpoint;
  },
  urlForUpdateRecord() {
    let endpoint = this.buildURL() + '/edit-object';
    return endpoint;
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
