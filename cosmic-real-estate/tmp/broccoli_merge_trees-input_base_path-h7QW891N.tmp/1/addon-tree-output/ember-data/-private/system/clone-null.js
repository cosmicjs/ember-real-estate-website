define("ember-data/-private/system/clone-null", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = cloneNull;
  function cloneNull(source) {
    var clone = Object.create(null);
    for (var key in source) {
      clone[key] = source[key];
    }
    return clone;
  }
});