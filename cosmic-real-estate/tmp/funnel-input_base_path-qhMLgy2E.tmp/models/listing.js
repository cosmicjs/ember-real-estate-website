import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  price: DS.attr(),
  address: DS.attr(),
  profileImage: DS.attr(),
  style: DS.attr(),
  neighborhood: DS.attr(),
  beds: DS.attr(),
  baths: DS.attr(),
  squareFeet: DS.attr(),
  zipCode: DS.attr(),
  content: DS.attr()
});
