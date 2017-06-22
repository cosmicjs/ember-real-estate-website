define('cosmic-real-estate/serializers/listing', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  function buildNormalizeListing(source) {
    return {
      id: source._id,
      slug: source.slug,
      content: source.content,
      title: source.title,
      price: source.metadata.price,
      address: source.metadata.address,
      profileImage: source.metadata.profile.url,
      style: source.metadata.style,
      neighborhood: source.metadata.neighborhood,
      beds: source.metadata.beds,
      baths: source.metadata.baths,
      squareFeet: source.metadata.square_feet,
      zipCode: source.metadata.zip_code

    };
  }
  exports.default = _emberData.default.RESTSerializer.extend({
    primaryKey: 'slug',
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
      if (payload.objects) {
        var normalizedListings = payload.objects.map(function (listing) {
          return buildNormalizeListing(listing);
        });
        payload = {
          listings: normalizedListings
        };
      } else {
        var normalizedListing = buildNormalizeListing(payload.object);
        payload = {
          listing: normalizedListing
        };
      }
      return this._super(store, primaryModelClass, payload, id, requestType);
    }
  });
});