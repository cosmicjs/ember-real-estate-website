import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('listings', function() {
    this.route('listing', { path: ':listing_slug'});
  });
});

export default Router;
