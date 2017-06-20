define('ember-bootstrap/utils/get-calculated-offset', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getCalculatedOffset;
  var assert = _ember.default.assert;
  function getCalculatedOffset(placement, pos, actualWidth, actualHeight) {
    switch (placement) {
      case 'bottom':
        return { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 };
      case 'top':
        return { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 };
      case 'left':
        return { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth };
      case 'right':
        return { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
      default:
        assert('position must be one of bottom|top|left|right', false);
    }
  }
});