define('ember-data/-private/system/store/container-instance-cache', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var set = _ember.default.set;

  var ContainerInstanceCache = function () {
    function ContainerInstanceCache(owner, store) {
      _classCallCheck(this, ContainerInstanceCache);

      this.isDestroying = false;
      this.isDestroyed = false;
      this._owner = owner;
      this._store = store;
      this._namespaces = {
        adapter: Object.create(null),
        serializer: Object.create(null)
      };
    }

    ContainerInstanceCache.prototype.get = function get(namespace, preferredKey) {
      var cache = this._namespaces[namespace];

      if (cache[preferredKey]) {
        return cache[preferredKey];
      }

      var preferredLookupKey = namespace + ':' + preferredKey;

      var instance = this._instanceFor(preferredLookupKey) || this._findInstance(namespace, this._fallbacksFor(namespace, preferredKey));
      if (instance) {
        cache[preferredKey] = instance;
        set(instance, 'store', this._store);
      }

      return cache[preferredKey];
    };

    ContainerInstanceCache.prototype._fallbacksFor = function _fallbacksFor(namespace, preferredKey) {
      if (namespace === 'adapter') {
        return ['application', this._store.get('adapter'), '-json-api'];
      }

      // serializer
      return ['application', this.get('adapter', preferredKey).get('defaultSerializer'), '-default'];
    };

    ContainerInstanceCache.prototype._findInstance = function _findInstance(namespace, fallbacks) {
      var cache = this._namespaces[namespace];

      for (var i = 0, length = fallbacks.length; i < length; i++) {
        var fallback = fallbacks[i];

        if (cache[fallback]) {
          return cache[fallback];
        }

        var lookupKey = namespace + ':' + fallback;
        var instance = this._instanceFor(lookupKey);

        if (instance) {
          cache[fallback] = instance;
          return instance;
        }
      }
    };

    ContainerInstanceCache.prototype._instanceFor = function _instanceFor(key) {
      return this._owner.lookup(key);
    };

    ContainerInstanceCache.prototype.destroyCache = function destroyCache(cache) {
      var cacheEntries = Object.keys(cache);

      for (var i = 0, length = cacheEntries.length; i < length; i++) {
        var cacheKey = cacheEntries[i];
        var cacheEntry = cache[cacheKey];
        if (cacheEntry) {
          cacheEntry.destroy();
        }
      }
    };

    ContainerInstanceCache.prototype.destroy = function destroy() {
      this.isDestroying = true;
      this.destroyCache(this._namespaces.adapter);
      this.destroyCache(this._namespaces.serializer);
      this.isDestroyed = true;
    };

    ContainerInstanceCache.prototype.toString = function toString() {
      return 'ContainerInstanceCache';
    };

    return ContainerInstanceCache;
  }();

  exports.default = ContainerInstanceCache;
});