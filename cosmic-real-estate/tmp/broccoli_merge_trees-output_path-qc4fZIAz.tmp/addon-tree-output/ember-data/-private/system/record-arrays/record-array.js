define("ember-data/-private/system/record-arrays/record-array", ["exports", "ember", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/snapshot-record-array"], function (exports, _ember, _promiseProxies, _snapshotRecordArray) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed,
      get = _ember.default.get,
      set = _ember.default.set,
      Promise = _ember.default.RSVP.Promise;
  exports.default = _ember.default.ArrayProxy.extend(_ember.default.Evented, {
    init: function init() {
      this._super.apply(this, arguments);

      /**
        The array of client ids backing the record array. When a
        record is requested from the record array, the record
        for the client id at the same index is materialized, if
        necessary, by the store.
         @property content
        @private
        @type Ember.Array
        */
      this.set('content', this.content || null);

      /**
      The flag to signal a `RecordArray` is finished loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isLoaded'); // true
      ```
       @property isLoaded
      @type Boolean
      */
      this.isLoaded = this.isLoaded || false;
      /**
      The flag to signal a `RecordArray` is currently loading data.
      Example
      ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
      people.update();
      people.get('isUpdating'); // true
      ```
      @property isUpdating
      @type Boolean
      */
      this.isUpdating = false;

      /**
      The store that created this record array.
      @property store
      @private
      @type DS.Store
      */
      this.store = this.store || null;
      this._updatingPromise = null;
    },
    replace: function replace() {
      throw new Error("The result of a server query (for all " + this.modelName + " types) is immutable. To modify contents, use toArray()");
    },


    /**
     The modelClass represented by this record array.
      @property type
     @type DS.Model
     */
    type: computed('modelName', function () {
      if (!this.modelName) {
        return null;
      }
      return this.store._modelFor(this.modelName);
    }).readOnly(),

    /**
      Retrieves an object from the content by index.
       @method objectAtContent
      @private
      @param {Number} index
      @return {DS.Model} record
    */
    objectAtContent: function objectAtContent(index) {
      var internalModel = get(this, 'content').objectAt(index);
      return internalModel && internalModel.getRecord();
    },


    /**
      Used to get the latest version of all of the records in this array
      from the adapter.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
       people.update().then(function() {
        people.get('isUpdating'); // false
      });
       people.get('isUpdating'); // true
      ```
       @method update
    */
    update: function update() {
      var _this = this;

      if (get(this, 'isUpdating')) {
        return this._updatingPromise;
      }

      this.set('isUpdating', true);

      var updatingPromise = this._update().finally(function () {
        _this._updatingPromise = null;
        if (_this.get('isDestroying') || _this.get('isDestroyed')) {
          return;
        }
        _this.set('isUpdating', false);
      });

      this._updatingPromise = updatingPromise;

      return updatingPromise;
    },


    /*
      Update this RecordArray and return a promise which resolves once the update
      is finished.
     */
    _update: function _update() {
      return this.store.findAll(this.modelName, { reload: true });
    },


    /**
      Adds an internal model to the `RecordArray` without duplicates
       @method addInternalModel
      @private
      @param {InternalModel} internalModel
    */
    _pushInternalModels: function _pushInternalModels(internalModels) {
      // pushObjects because the internalModels._recordArrays set was already
      // consulted for inclusion, so addObject and its on .contains call is not
      // required.
      get(this, 'content').pushObjects(internalModels);
    },


    /**
      Removes an internalModel to the `RecordArray`.
       @method removeInternalModel
      @private
      @param {InternalModel} internalModel
    */
    _removeInternalModels: function _removeInternalModels(internalModels) {
      get(this, 'content').removeObjects(internalModels);
    },


    /**
      Saves all of the records in the `RecordArray`.
       Example
       ```javascript
      var messages = store.peekAll('message');
      messages.forEach(function(message) {
        message.set('hasBeenSeen', true);
      });
      messages.save();
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var _this2 = this;

      var promiseLabel = "DS: RecordArray#save " + this.modelName;
      var promise = Promise.all(this.invoke('save'), promiseLabel).then(function () {
        return _this2;
      }, null, 'DS: RecordArray#save return RecordArray');

      return _promiseProxies.PromiseArray.create({ promise: promise });
    },
    _dissociateFromOwnRecords: function _dissociateFromOwnRecords() {
      var _this3 = this;

      this.get('content').forEach(function (internalModel) {
        var recordArrays = internalModel.__recordArrays;

        if (recordArrays) {
          recordArrays.delete(_this3);
        }
      });
    },


    /**
      @method _unregisterFromManager
      @private
    */
    _unregisterFromManager: function _unregisterFromManager() {
      this.manager.unregisterRecordArray(this);
    },
    willDestroy: function willDestroy() {
      this._unregisterFromManager();
      this._dissociateFromOwnRecords();
      // TODO: we should not do work during destroy:
      //   * when objects are destroyed, they should simply be left to do
      //   * if logic errors do to this, that logic needs to be more careful during
      //    teardown (ember provides isDestroying/isDestroyed) for this reason
      //   * the exception being: if an dominator has a reference to this object,
      //     and must be informed to release e.g. e.g. removing itself from th
      //     recordArrayMananger
      set(this, 'content', null);
      set(this, 'length', 0);
      this._super.apply(this, arguments);
    },


    /*
      @method _createSnapshot
      @private
    */
    _createSnapshot: function _createSnapshot(options) {
      // this is private for users, but public for ember-data internals
      return new _snapshotRecordArray.default(this, this.get('meta'), options);
    },


    /*
      @method _takeSnapshot
      @private
    */
    _takeSnapshot: function _takeSnapshot() {
      return get(this, 'content').map(function (internalModel) {
        return internalModel.createSnapshot();
      });
    }
  });
});