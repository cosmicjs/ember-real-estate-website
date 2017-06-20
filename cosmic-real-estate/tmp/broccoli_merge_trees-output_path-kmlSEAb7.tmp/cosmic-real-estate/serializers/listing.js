define('cosmic-real-estate/serializers/listing', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.RESTSerializer.extend({
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
      var normalizedListings = payload.objects.map(function (listing) {
        var obj = {
          id: listing._id,
          title: listing.title,
          price: listing.metadata.price,
          address: listing.metadata.address,
          profileImage: listing.metadata.profile.url,
          style: listing.metadata.style,
          location: listing.metadata.location
        };
        return obj;
      });
      payload = {
        listings: normalizedListings
      };
      return this._super(store, primaryModelClass, payload, id, requestType);
    }
  });
});