define("ember-data/relationships", ["exports", "ember-data/-private/system/relationships/belongs-to", "ember-data/-private/system/relationships/has-many"], function (exports, _belongsTo, _hasMany) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasMany = exports.belongsTo = undefined;
  exports.belongsTo = _belongsTo.default;
  exports.hasMany = _hasMany.default;
});