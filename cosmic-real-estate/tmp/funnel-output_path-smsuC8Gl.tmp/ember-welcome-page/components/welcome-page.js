import Ember from 'ember';
import layout from '../templates/components/welcome-page';

export default Ember.Component.extend({
  layout,

  emberVersion: Ember.computed(function() {
    let [ major, minor ] = Ember.VERSION.split(".");

    return `${major}.${minor}.0`;
  })
});
