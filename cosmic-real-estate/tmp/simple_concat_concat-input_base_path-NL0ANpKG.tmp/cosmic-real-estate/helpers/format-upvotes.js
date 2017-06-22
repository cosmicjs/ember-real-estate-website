define('cosmic-real-estate/helpers/format-upvotes', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatUpvotes = formatUpvotes;
  function formatUpvotes(upvote) {
    if (upvote > 0) {
      return '<span class="text-success">' + upvote + '</span>';
    } else if (upvote < 0) {
      return '<span class="text-danger">' + upvote + '</span>';
    } else {
      return '<span class="text-muted">' + upvote + '</span>';
    }
  }

  exports.default = _ember.default.Helper.helper(formatUpvotes);
});