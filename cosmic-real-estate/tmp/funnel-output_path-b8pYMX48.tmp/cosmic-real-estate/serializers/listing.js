import DS from 'ember-data';

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

  }
}
export default DS.RESTSerializer.extend({
  primaryKey: 'slug',
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload.objects) {
      let normalizedListings = payload.objects.map(function(listing) {
        return buildNormalizeListing(listing)
      });
      payload = {
        listings: normalizedListings
      };
    } else {
      let normalizedListing = buildNormalizeListing(payload.object);
      payload = {
        listing: normalizedListing
      }
    }
    return this._super(store, primaryModelClass, payload, id, requestType);

  }
});
