import Ember from 'ember';

export function formatUpvotes(upvote) {
  if (upvote > 0) {
    return '<span class="text-success">' + upvote + '</span>';
  } else if (upvote < 0) {
    return '<span class="text-danger">' + upvote + '</span>';
  } else {
    return '<span class="text-muted">' + upvote + '</span>';
  }
}

export default Ember.Helper.helper(formatUpvotes);
