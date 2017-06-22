import DS from 'ember-data';
import config from '../config/environment';

console.log(config);
export default DS.RESTAdapter.extend({
  host: 'https://api.cosmicjs.com/v1/' + config.cosmic.cosmicBucket,
  urlForFindAll(modelName, snapshot) {
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
