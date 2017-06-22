define('cosmic-real-estate/components/real-estate-listing', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  function updateVote(upvotes, listing_slug, store) {
    store.findRecord('listing', listing_slug).then(function (listing) {
      listing.set('upvotes', upvotes);
      listing.save();
    });
  }

  exports.default = _ember.default.Component.extend({
    store: _ember.default.inject.service(),
    upvotes: _ember.default.computed('upvotes', function () {
      return this.get('listing.upvotes');
    }),
    slug: _ember.default.computed('slug', function () {
      return this.get('listing.id');
    }),
    actions: {
      vote: function vote(direction) {
        var upvotes = this.get('upvotes');
        direction === 'up' ? upvotes++ : upvotes--;
        this.set('upvotes', upvotes);
        var slug = this.get('slug');
        var store = this.get('store');
        updateVote(upvotes, slug, store);
      }
    }
  });
});