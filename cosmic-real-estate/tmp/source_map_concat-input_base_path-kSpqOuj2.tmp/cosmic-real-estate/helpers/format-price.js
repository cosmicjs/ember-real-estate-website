define('cosmic-real-estate/helpers/format-price', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatPrice = formatPrice;

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  function formatPrice(_ref) {
    var _ref2 = _toArray(_ref),
        value = _ref2[0],
        rest = _ref2.slice(1);

    return '$' + value.toLocaleString();
  }

  exports.default = _ember.default.Helper.helper(formatPrice);
});