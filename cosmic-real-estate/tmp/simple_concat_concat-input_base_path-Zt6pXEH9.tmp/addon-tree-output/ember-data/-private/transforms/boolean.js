define("ember-data/-private/transforms/boolean", ["exports", "ember", "ember-data/transform"], function (exports, _ember, _transform) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var isNone = _ember.default.isNone;
  exports.default = _transform.default.extend({
    deserialize: function deserialize(serialized, options) {
      var type = typeof serialized === "undefined" ? "undefined" : _typeof(serialized);

      if (isNone(serialized) && options.allowNull === true) {
        return null;
      }

      if (type === "boolean") {
        return serialized;
      } else if (type === "string") {
        return serialized.match(/^true$|^t$|^1$/i) !== null;
      } else if (type === "number") {
        return serialized === 1;
      } else {
        return false;
      }
    },
    serialize: function serialize(deserialized, options) {
      if (isNone(deserialized) && options.allowNull === true) {
        return null;
      }

      return Boolean(deserialized);
    }
  });
});