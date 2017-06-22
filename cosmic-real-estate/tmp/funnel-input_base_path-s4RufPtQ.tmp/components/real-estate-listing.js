import Ember from 'ember';

function updateVote(upvotes,listing_slug,store) {
  store.findRecord('listing', listing_slug).then(function(listing) {
    listing.set('upvotes',upvotes);
    listing.save();
  })
}

export default Ember.Component.extend({
  store: Ember.inject.service(),
  upvotes: Ember.computed('upvotes', function() {
    return this.get('listing.upvotes');
  }),
  slug: Ember.computed('slug', function() {
    return this.get('listing.id');
  }),
  actions: {
    vote(direction) {
      let upvotes = this.get('upvotes');
      direction === 'up' ?
        upvotes++ :
        upvotes--;
      this.set('upvotes', upvotes);
      let slug = this.get('slug');
      let store = this.get('store');
      updateVote(upvotes,slug,store);
    }
  }
});
