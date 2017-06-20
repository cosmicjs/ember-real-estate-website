define('ember-bootstrap/utils/listen-to-cp', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (dependentKey) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    return computed(dependentKey, {
      get: function get() {
        return getWithDefault(this, dependentKey, defaultValue);
      },
      set: function set(key, value) {
        // eslint-disable-line no-unused-vars
        return value;
      }
    });
  };

  var computed = _ember.default.computed,
      getWithDefault = _ember.default.getWithDefault;
});