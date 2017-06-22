define('cosmic-real-estate/routes/listings/listing', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('listing', params.listing_id);
    }
  });
});