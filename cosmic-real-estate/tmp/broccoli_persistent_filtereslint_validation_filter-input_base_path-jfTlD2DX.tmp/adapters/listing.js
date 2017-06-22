import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'https://api.cosmicjs.com/v1/cosmic-real-estate',
  urlForFindAll(modelName, snapshot) {
    let path = this.pathForType(modelName);
    return this.buildURL() + '/object-type/' + path;
  },
  urlForFindRecord(slug) {
    return this.buildURL() + '/object/' + slug;
  }
});
