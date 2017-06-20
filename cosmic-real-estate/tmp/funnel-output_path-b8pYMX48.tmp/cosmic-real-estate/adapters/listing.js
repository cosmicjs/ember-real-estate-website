import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'https://api.cosmicjs.com/v1/cosmic-real-estate',
  namespace: 'object-type',
  pathForType(modelName) {
    modelName = Ember.String.pluralize(modelName);
    return modelName.concat("?hide_metafields=true");
  }
});
