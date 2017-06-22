define("ember-data/-private/system/record-arrays/adapter-populated-record-array", ["exports", "ember", "ember-data/-private/system/record-arrays/record-array", "ember-data/-private/system/clone-null"], function (exports, _ember, _recordArray, _cloneNull) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = _ember.default.get;
  exports.default = _recordArray.default.extend({
    init: function init() {
      // yes we are touching `this` before super, but ArrayProxy has a bug that requires this.
      this.set('content', this.get('content') || _ember.default.A());

      this._super.apply(this, arguments);
      this.query = this.query || null;
      this.links = null;
    },
    replace: function replace() {
      throw new Error("The result of a server query (on " + this.modelName + ") is immutable.");
    },
    _update: function _update() {
      var store = get(this, 'store');
      var query = get(this, 'query');

      return store._query(this.modelName, query, this);
    },


    /**
      @method _setInternalModels
      @param {Array} internalModels
      @param {Object} payload normalized payload
      @private
    */
    _setInternalModels: function _setInternalModels(internalModels, payload) {

      // TODO: initial load should not cause change events at all, only
      // subsequent. This requires changing the public api of adapter.query, but
      // hopefully we can do that soon.
      this.get('content').setObjects(internalModels);

      this.setProperties({
        isLoaded: true,
        isUpdating: false,
        meta: (0, _cloneNull.default)(payload.meta),
        links: (0, _cloneNull.default)(payload.links)
      });

      for (var i = 0, l = internalModels.length; i < l; i++) {
        var internalModel = internalModels[i];
        this.manager.recordArraysForRecord(internalModel).add(this);
      }

      // TODO: should triggering didLoad event be the last action of the runLoop?
      _ember.default.run.once(this, 'trigger', 'didLoad');
    }
  });
});