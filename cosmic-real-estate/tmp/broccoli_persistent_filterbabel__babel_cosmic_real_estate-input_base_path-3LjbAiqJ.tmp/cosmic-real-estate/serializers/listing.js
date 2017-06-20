import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    let normalizedListings = payload.objects.map(function(listing) {
      let obj = {
        id: listing._id,
        title: listing.title,
        price: listing.metadata.price,
        address: listing.metadata.address,
        profileImage: listing.metadata.profile.url,
        style: listing.metadata.style,
        location: listing.metadata.location
      }
      return obj
    });
    payload = {
      listings: normalizedListings
    };
    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
