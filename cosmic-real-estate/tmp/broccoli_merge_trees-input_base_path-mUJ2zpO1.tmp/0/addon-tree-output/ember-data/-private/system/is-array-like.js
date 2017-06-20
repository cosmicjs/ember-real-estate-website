define('ember-data/-private/system/is-array-like', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isArrayLike;


  /*
    We're using this to detect arrays and "array-like" objects.
  
    This is a copy of the `isArray` method found in `ember-runtime/utils` as we're
    currently unable to import non-exposed modules.
  
    This method was previously exposed as `Ember.isArray` but since
    https://github.com/emberjs/ember.js/pull/11463 `Ember.isArray` is an alias of
    `Array.isArray` hence removing the "array-like" part.
   */
  function isArrayLike(obj) {
    if (!obj || obj.setInterval) {
      return false;
    }
    if (Array.isArray(obj)) {
      return true;
    }
    if (_ember.default.Array.detect(obj)) {
      return true;
    }

    var type = _ember.default.typeOf(obj);
    if ('array' === type) {
      return true;
    }
    if (obj.length !== undefined && 'object' === type) {
      return true;
    }
    return false;
  }
});