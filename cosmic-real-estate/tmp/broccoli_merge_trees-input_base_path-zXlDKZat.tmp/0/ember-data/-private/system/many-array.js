define("ember-data/-private/system/many-array", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/store/common", "ember-data/-private/system/diff-array"], function (exports, _ember, _debug, _promiseProxies, _common, _diffArray) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = _ember.default.get,
      set = _ember.default.set;
  exports.default = _ember.default.Object.extend(_ember.default.MutableArray, _ember.default.Evented, {
    init: function init() {
      this._super.apply(this, arguments);

      /**
      The loading state of this array
       @property {Boolean} isLoaded
      */
      this.isLoaded = false;
      this.length = 0;

      /**
      Used for async `hasMany` arrays
      to keep track of when they will resolve.
       @property {Ember.RSVP.Promise} promise
      @private
      */
      this.promise = null;

      /**
      Metadata associated with the request for async hasMany relationships.
       Example
       Given that the server returns the following JSON payload when fetching a
      hasMany relationship:
       ```js
      {
        "comments": [{
          "id": 1,
          "comment": "This is the first comment",
        }, {
      // ...
        }],
         "meta": {
          "page": 1,
          "total": 5
        }
      }
      ```
       You can then access the metadata via the `meta` property:
       ```js
      post.get('comments').then(function(comments) {
        var meta = comments.get('meta');
       // meta.page => 1
      // meta.total => 5
      });
      ```
       @property {Object} meta
      @public
      */
      this.meta = this.meta || null;

      /**
      `true` if the relationship is polymorphic, `false` otherwise.
       @property {Boolean} isPolymorphic
      @private
      */
      this.isPolymorphic = this.isPolymorphic || false;

      /**
      The relationship which manages this array.
       @property {ManyRelationship} relationship
      @private
      */
      this.relationship = this.relationship || null;

      this.currentState = [];
      this.flushCanonical(false);
    },
    objectAt: function objectAt(index) {
      var object = this.currentState[index];
      //Ember observers such as 'firstObject', 'lastObject' might do out of bounds accesses
      if (object === undefined) {
        return;
      }

      return object.getRecord();
    },
    flushCanonical: function flushCanonical() {
      var isInitialized = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      // It’s possible the parent side of the relationship may have been unloaded by this point
      if (!(0, _common._objectIsAlive)(this)) {
        return;
      }
      var toSet = this.canonicalState;

      //a hack for not removing new records
      //TODO remove once we have proper diffing
      var newRecords = this.currentState.filter(
      // only add new records which are not yet in the canonical state of this
      // relationship (a new record can be in the canonical state if it has
      // been 'acknowleged' to be in the relationship via a store.push)
      function (internalModel) {
        return internalModel.isNew() && toSet.indexOf(internalModel) === -1;
      });
      toSet = toSet.concat(newRecords);

      // diff to find changes
      var diff = (0, _diffArray.default)(this.currentState, toSet);

      if (diff.firstChangeIndex !== null) {
        // it's null if no change found
        // we found a change
        this.arrayContentWillChange(diff.firstChangeIndex, diff.removedCount, diff.addedCount);
        this.set('length', toSet.length);
        this.currentState = toSet;
        this.arrayContentDidChange(diff.firstChangeIndex, diff.removedCount, diff.addedCount);
        if (isInitialized && diff.addedCount > 0) {
          //notify only on additions
          //TODO only notify if unloaded
          this.relationship.notifyHasManyChanged();
        }
      }
    },
    internalReplace: function internalReplace(idx, amt, objects) {
      if (!objects) {
        objects = [];
      }
      this.arrayContentWillChange(idx, amt, objects.length);
      this.currentState.splice.apply(this.currentState, [idx, amt].concat(objects));
      this.set('length', this.currentState.length);
      this.arrayContentDidChange(idx, amt, objects.length);
    },


    //TODO(Igor) optimize
    internalRemoveRecords: function internalRemoveRecords(records) {
      for (var i = 0; i < records.length; i++) {
        var index = this.currentState.indexOf(records[i]);
        this.internalReplace(index, 1);
      }
    },


    //TODO(Igor) optimize
    internalAddRecords: function internalAddRecords(records, idx) {
      if (idx === undefined) {
        idx = this.currentState.length;
      }
      this.internalReplace(idx, 0, records);
    },
    replace: function replace(idx, amt, objects) {
      var records = void 0;
      if (amt > 0) {
        records = this.currentState.slice(idx, idx + amt);
        this.get('relationship').removeRecords(records);
      }
      if (objects) {
        this.get('relationship').addRecords(objects.map(function (obj) {
          return obj._internalModel;
        }), idx);
      }
    },


    /**
      @method loadingRecordsCount
      @param {Number} count
      @private
    */
    loadingRecordsCount: function loadingRecordsCount(count) {
      this._loadingRecordsCount = count;
    },


    /**
      @method loadedRecord
      @private
    */
    loadedRecord: function loadedRecord() {
      this._loadingRecordsCount--;
      if (this._loadingRecordsCount === 0) {
        set(this, 'isLoaded', true);
        this.trigger('didLoad');
      }
    },


    /**
      Reloads all of the records in the manyArray. If the manyArray
      holds a relationship that was originally fetched using a links url
      Ember Data will revisit the original links url to repopulate the
      relationship.
       If the manyArray holds the result of a `store.query()` reload will
      re-run the original query.
       Example
       ```javascript
      var user = store.peekRecord('user', 1)
      user.login().then(function() {
        user.get('permissions').then(function(permissions) {
          return permissions.reload();
        });
      });
      ```
       @method reload
      @public
    */
    reload: function reload() {
      return this.relationship.reload();
    },


    /**
      Saves all of the records in the `ManyArray`.
       Example
       ```javascript
      store.findRecord('inbox', 1).then(function(inbox) {
        inbox.get('messages').then(function(messages) {
          messages.forEach(function(message) {
            message.set('isRead', true);
          });
          messages.save()
        });
      });
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var manyArray = this;
      var promiseLabel = 'DS: ManyArray#save ' + get(this, 'type');
      var promise = _ember.default.RSVP.all(this.invoke("save"), promiseLabel).then(function () {
        return manyArray;
      }, null, 'DS: ManyArray#save return ManyArray');

      return _promiseProxies.PromiseArray.create({ promise: promise });
    },


    /**
      Create a child record within the owner
       @method createRecord
      @private
      @param {Object} hash
      @return {DS.Model} record
    */
    createRecord: function createRecord(hash) {
      var store = get(this, 'store');
      var type = get(this, 'type');

      (0, _debug.assert)("You cannot add '" + type.modelName + "' records to this polymorphic relationship.", !get(this, 'isPolymorphic'));
      var record = store.createRecord(type.modelName, hash);
      this.pushObject(record);

      return record;
    }
  });
});