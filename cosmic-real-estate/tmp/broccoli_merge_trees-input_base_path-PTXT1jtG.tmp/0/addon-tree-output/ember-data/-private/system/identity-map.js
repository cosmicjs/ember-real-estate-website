define('ember-data/-private/system/identity-map', ['exports', 'ember-data/-private/system/internal-model-map'], function (exports, _internalModelMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var IdentityMap = function () {
    function IdentityMap() {
      _classCallCheck(this, IdentityMap);

      this._map = Object.create(null);
    }

    /**
     Retrieves the `InternalModelMap` for a given modelName,
     creating one if one did not already exist. This is
     similar to `getWithDefault` or `get` on a `MapWithDefault`
      @method retrieve
     @param modelName a previously normalized modelName
     @returns {InternalModelMap} the InternalModelMap for the given modelName
     */


    IdentityMap.prototype.retrieve = function retrieve(modelName) {
      var map = this._map[modelName];

      if (!map) {
        map = this._map[modelName] = new _internalModelMap.default(modelName);
      }

      return map;
    };

    IdentityMap.prototype.clear = function clear() {
      var map = this._map;
      var keys = Object.keys(map);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        map[key].clear();
      }
    };

    return IdentityMap;
  }();

  exports.default = IdentityMap;
});