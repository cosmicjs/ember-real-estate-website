import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  price: DS.attr(),
  address: DS.attr(),
  profileImage: DS.attr(),
  style: DS.attr(),
  location: DS.attr(),
});
