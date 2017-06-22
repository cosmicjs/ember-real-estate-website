define('cosmic-real-estate/router', ['exports', 'ember', 'cosmic-real-estate/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = _ember.default.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('listings', function () {
      this.route('listing', { path: ':listing_slug' });
    });
  });

  exports.default = Router;
});