define("ember-data/-private/system/model/internal-model", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/model/states", "ember-data/-private/system/relationships/state/create", "ember-data/-private/system/snapshot", "ember-data/-private/features", "ember-data/-private/system/ordered-set", "ember-data/-private/utils", "ember-data/-private/system/references"], function (exports, _ember, _debug, _states, _create, _snapshot, _features, _orderedSet, _utils, _references) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var get = _ember.default.get,
      set = _ember.default.set,
      copy = _ember.default.copy,
      EmberError = _ember.default.Error,
      inspect = _ember.default.inspect,
      isEmpty = _ember.default.isEmpty,
      isEqual = _ember.default.isEqual,
      setOwner = _ember.default.setOwner,
      RSVP = _ember.default.RSVP,
      Promise = _ember.default.RSVP.Promise;


  var assign = _ember.default.assign || _ember.default.merge;

  /*
    The TransitionChainMap caches the `state.enters`, `state.setups`, and final state reached
    when transitioning from one state to another, so that future transitions can replay the
    transition without needing to walk the state tree, collect these hook calls and determine
     the state to transition into.
  
     A future optimization would be to build a single chained method out of the collected enters
     and setups. It may also be faster to do a two level cache (from: { to }) instead of caching based
     on a key that adds the two together.
   */
  var TransitionChainMap = Object.create(null);

  var _extractPivotNameCache = Object.create(null);
  var _splitOnDotCache = Object.create(null);

  function splitOnDot(name) {
    return _splitOnDotCache[name] || (_splitOnDotCache[name] = name.split('.'));
  }

  function extractPivotName(name) {
    return _extractPivotNameCache[name] || (_extractPivotNameCache[name] = splitOnDot(name)[0]);
  }

  function areAllModelsUnloaded(internalModels) {
    for (var i = 0; i < internalModels.length; ++i) {
      var record = internalModels[i].record;
      if (record && !(record.get('isDestroyed') || record.get('isDestroying'))) {
        return false;
      }
    }
    return true;
  }

  // this (and all heimdall instrumentation) will be stripped by a babel transform
  //  https://github.com/heimdalljs/babel5-plugin-strip-heimdall


  var InternalModelReferenceId = 1;
  var nextBfsId = 1;

  /*
    `InternalModel` is the Model class that we use internally inside Ember Data to represent models.
    Internal ED methods should only deal with `InternalModel` objects. It is a fast, plain Javascript class.
  
    We expose `DS.Model` to application code, by materializing a `DS.Model` from `InternalModel` lazily, as
    a performance optimization.
  
    `InternalModel` should never be exposed to application code. At the boundaries of the system, in places
    like `find`, `push`, etc. we convert between Models and InternalModels.
  
    We need to make sure that the properties from `InternalModel` are correctly exposed/proxied on `Model`
    if they are needed.
  
    @private
    @class InternalModel
  */

  var InternalModel = function () {
    function InternalModel(modelName, id, store, data) {
      _classCallCheck(this, InternalModel);

      this.id = id;

      // this ensure ordered set can quickly identify this as unique
      this[_ember.default.GUID_KEY] = InternalModelReferenceId++ + 'internal-model';

      this.store = store;
      this.modelName = modelName;
      this._loadingPromise = null;
      this._record = null;
      this._isDestroyed = false;
      this.isError = false;
      this._isUpdatingRecordArrays = false;

      // During dematerialization we don't want to rematerialize the record.  The
      // reason this might happen is that dematerialization removes records from
      // record arrays,  and Ember arrays will always `objectAt(0)` and
      // `objectAt(len - 1)` to test whether or not `firstObject` or `lastObject`
      // have changed.
      this._isDematerializing = false;

      this.resetRecord();

      if (data) {
        this.__data = data;
      }

      // caches for lazy getters
      this._modelClass = null;
      this.__deferredTriggers = null;
      this.__recordArrays = null;
      this._references = null;
      this._recordReference = null;
      this.__relationships = null;
      this.__implicitRelationships = null;

      // Used during the mark phase of unloading to avoid checking the same internal
      // model twice in the same scan
      this._bfsId = 0;
    }

    InternalModel.prototype.isEmpty = function isEmpty() {
      return this.currentState.isEmpty;
    };

    InternalModel.prototype.isLoading = function isLoading() {
      return this.currentState.isLoading;
    };

    InternalModel.prototype.isLoaded = function isLoaded() {
      return this.currentState.isLoaded;
    };

    InternalModel.prototype.hasDirtyAttributes = function hasDirtyAttributes() {
      return this.currentState.hasDirtyAttributes;
    };

    InternalModel.prototype.isSaving = function isSaving() {
      return this.currentState.isSaving;
    };

    InternalModel.prototype.isDeleted = function isDeleted() {
      return this.currentState.isDeleted;
    };

    InternalModel.prototype.isNew = function isNew() {
      return this.currentState.isNew;
    };

    InternalModel.prototype.isValid = function isValid() {
      return this.currentState.isValid;
    };

    InternalModel.prototype.dirtyType = function dirtyType() {
      return this.currentState.dirtyType;
    };

    InternalModel.prototype.getRecord = function getRecord() {
      if (!this._record && !this._isDematerializing) {

        // lookupFactory should really return an object that creates
        // instances with the injections applied
        var createOptions = {
          store: this.store,
          _internalModel: this,
          id: this.id,
          currentState: this.currentState,
          isError: this.isError,
          adapterError: this.error
        };

        if (setOwner) {
          // ensure that `getOwner(this)` works inside a model instance
          setOwner(createOptions, (0, _utils.getOwner)(this.store));
        } else {
          createOptions.container = this.store.container;
        }

        this._record = this.store.modelFactoryFor(this.modelName).create(createOptions);

        this._triggerDeferredTriggers();
      }

      return this._record;
    };

    InternalModel.prototype.resetRecord = function resetRecord() {
      this._record = null;
      this.dataHasInitialized = false;
      this.isReloading = false;
      this.error = null;
      this.currentState = _states.default.empty;
      this.__attributes = null;
      this.__inFlightAttributes = null;
      this._data = null;
    };

    InternalModel.prototype.dematerializeRecord = function dematerializeRecord() {
      if (this.record) {
        this._isDematerializing = true;
        this.record.destroy();
        this.destroyRelationships();
        this.updateRecordArrays();
        this.resetRecord();
      }
    };

    InternalModel.prototype.deleteRecord = function deleteRecord() {
      this.send('deleteRecord');
    };

    InternalModel.prototype.save = function save(options) {
      var promiseLabel = "DS: Model#save " + this;
      var resolver = RSVP.defer(promiseLabel);

      this.store.scheduleSave(this, resolver, options);
      return resolver.promise;
    };

    InternalModel.prototype.startedReloading = function startedReloading() {
      this.isReloading = true;
      if (this.hasRecord) {
        set(this.record, 'isReloading', true);
      }
    };

    InternalModel.prototype.finishedReloading = function finishedReloading() {
      this.isReloading = false;
      if (this.hasRecord) {
        set(this.record, 'isReloading', false);
      }
    };

    InternalModel.prototype.reload = function reload() {
      this.startedReloading();
      var internalModel = this;
      var promiseLabel = "DS: Model#reload of " + this;

      return new Promise(function (resolve) {
        internalModel.send('reloadRecord', resolve);
      }, promiseLabel).then(function () {
        internalModel.didCleanError();
        return internalModel;
      }, function (error) {
        internalModel.didError(error);
        throw error;
      }, "DS: Model#reload complete, update flags").finally(function () {
        internalModel.finishedReloading();
        internalModel.updateRecordArrays();
      });
    };

    InternalModel.prototype._directlyRelatedInternalModels = function _directlyRelatedInternalModels() {
      var _this = this;

      var array = [];
      this.type.eachRelationship(function (key, relationship) {
        if (_this._relationships.has(key)) {
          var _relationship = _this._relationships.get(key);
          var localRelationships = _relationship.members.toArray();
          var serverRelationships = _relationship.canonicalMembers.toArray();

          array = array.concat(localRelationships, serverRelationships);
        }
      });
      return array;
    };

    InternalModel.prototype._allRelatedInternalModels = function _allRelatedInternalModels() {
      var array = [];
      var queue = [];
      var bfsId = nextBfsId++;
      queue.push(this);
      this._bfsId = bfsId;
      while (queue.length > 0) {
        var node = queue.shift();
        array.push(node);
        var related = node._directlyRelatedInternalModels();
        for (var i = 0; i < related.length; ++i) {
          var internalModel = related[i];
          (0, _debug.assert)('Internal Error: seen a future bfs iteration', internalModel._bfsId <= bfsId);
          if (internalModel._bfsId < bfsId) {
            queue.push(internalModel);
            internalModel._bfsId = bfsId;
          }
        }
      }
      return array;
    };

    InternalModel.prototype.unloadRecord = function unloadRecord() {
      this.send('unloadRecord');
      this.dematerializeRecord();
      _ember.default.run.schedule('destroy', this, '_checkForOrphanedInternalModels');
    };

    InternalModel.prototype._checkForOrphanedInternalModels = function _checkForOrphanedInternalModels() {
      this._isDematerializing = false;
      if (this.isDestroyed) {
        return;
      }

      this._cleanupOrphanedInternalModels();
    };

    InternalModel.prototype._cleanupOrphanedInternalModels = function _cleanupOrphanedInternalModels() {
      var relatedInternalModels = this._allRelatedInternalModels();
      if (areAllModelsUnloaded(relatedInternalModels)) {
        for (var i = 0; i < relatedInternalModels.length; ++i) {
          var internalModel = relatedInternalModels[i];
          if (!internalModel.isDestroyed) {
            internalModel.destroy();
          }
        }
      }
    };

    InternalModel.prototype.eachRelationship = function eachRelationship(callback, binding) {
      return this.modelClass.eachRelationship(callback, binding);
    };

    InternalModel.prototype.destroy = function destroy() {
      (0, _debug.assert)("Cannot destroy an internalModel while its record is materialized", !this.record || this.record.get('isDestroyed') || this.record.get('isDestroying'));

      this.store._removeFromIdMap(this);
      this._isDestroyed = true;
    };

    InternalModel.prototype.eachAttribute = function eachAttribute(callback, binding) {
      return this.modelClass.eachAttribute(callback, binding);
    };

    InternalModel.prototype.inverseFor = function inverseFor(key) {
      return this.modelClass.inverseFor(key);
    };

    InternalModel.prototype.setupData = function setupData(data) {
      var changedKeys = void 0;

      if (this.hasRecord) {
        changedKeys = this._changedKeys(data.attributes);
      }

      assign(this._data, data.attributes);
      this.pushedData();

      if (this.hasRecord) {
        this.record._notifyProperties(changedKeys);
      }
      this.didInitializeData();
    };

    InternalModel.prototype.becameReady = function becameReady() {
      this.store.recordArrayManager.recordWasLoaded(this);
    };

    InternalModel.prototype.didInitializeData = function didInitializeData() {
      if (!this.dataHasInitialized) {
        this.becameReady();
        this.dataHasInitialized = true;
      }
    };

    InternalModel.prototype.createSnapshot = function createSnapshot(options) {
      return new _snapshot.default(this, options);
    };

    InternalModel.prototype.loadingData = function loadingData(promise) {
      this.send('loadingData', promise);
    };

    InternalModel.prototype.loadedData = function loadedData() {
      this.send('loadedData');
      this.didInitializeData();
    };

    InternalModel.prototype.notFound = function notFound() {
      this.send('notFound');
    };

    InternalModel.prototype.pushedData = function pushedData() {
      this.send('pushedData');
    };

    InternalModel.prototype.flushChangedAttributes = function flushChangedAttributes() {
      this._inFlightAttributes = this._attributes;
      this._attributes = Object.create(null);
    };

    InternalModel.prototype.hasChangedAttributes = function hasChangedAttributes() {
      return Object.keys(this._attributes).length > 0;
    };

    InternalModel.prototype.updateChangedAttributes = function updateChangedAttributes() {
      var changedAttributes = this.changedAttributes();
      var changedAttributeNames = Object.keys(changedAttributes);
      var attrs = this._attributes;

      for (var i = 0, length = changedAttributeNames.length; i < length; i++) {
        var attribute = changedAttributeNames[i];
        var data = changedAttributes[attribute];
        var oldData = data[0];
        var newData = data[1];

        if (oldData === newData) {
          delete attrs[attribute];
        }
      }
    };

    InternalModel.prototype.changedAttributes = function changedAttributes() {
      var oldData = this._data;
      var currentData = this._attributes;
      var inFlightData = this._inFlightAttributes;
      var newData = assign(copy(inFlightData), currentData);
      var diffData = Object.create(null);
      var newDataKeys = Object.keys(newData);

      for (var i = 0, length = newDataKeys.length; i < length; i++) {
        var key = newDataKeys[i];
        diffData[key] = [oldData[key], newData[key]];
      }

      return diffData;
    };

    InternalModel.prototype.adapterWillCommit = function adapterWillCommit() {
      this.send('willCommit');
    };

    InternalModel.prototype.adapterDidDirty = function adapterDidDirty() {
      this.send('becomeDirty');
      this.updateRecordArrays();
    };

    InternalModel.prototype.send = function send(name, context) {
      var currentState = this.currentState;

      if (!currentState[name]) {
        this._unhandledEvent(currentState, name, context);
      }

      return currentState[name](this, context);
    };

    InternalModel.prototype.notifyHasManyAdded = function notifyHasManyAdded(key, record, idx) {
      if (this.hasRecord) {
        this.record.notifyHasManyAdded(key, record, idx);
      }
    };

    InternalModel.prototype.notifyHasManyRemoved = function notifyHasManyRemoved(key, record, idx) {
      if (this.hasRecord) {
        this.record.notifyHasManyRemoved(key, record, idx);
      }
    };

    InternalModel.prototype.notifyBelongsToChanged = function notifyBelongsToChanged(key, record) {
      if (this.hasRecord) {
        this.record.notifyBelongsToChanged(key, record);
      }
    };

    InternalModel.prototype.notifyPropertyChange = function notifyPropertyChange(key) {
      if (this.hasRecord) {
        this.record.notifyPropertyChange(key);
      }
    };

    InternalModel.prototype.rollbackAttributes = function rollbackAttributes() {
      var dirtyKeys = Object.keys(this._attributes);

      this._attributes = Object.create(null);

      if (get(this, 'isError')) {
        this._inFlightAttributes = Object.create(null);
        this.didCleanError();
      }

      //Eventually rollback will always work for relationships
      //For now we support it only out of deleted state, because we
      //have an explicit way of knowing when the server acked the relationship change
      if (this.isDeleted()) {
        //TODO: Should probably move this to the state machine somehow
        this.becameReady();
      }

      if (this.isNew()) {
        this.clearRelationships();
      }

      if (this.isValid()) {
        this._inFlightAttributes = Object.create(null);
      }

      this.send('rolledBack');

      this.record._notifyProperties(dirtyKeys);
    };

    InternalModel.prototype.transitionTo = function transitionTo(name) {
      // POSSIBLE TODO: Remove this code and replace with
      // always having direct reference to state objects

      var pivotName = extractPivotName(name);
      var state = this.currentState;
      var transitionMapId = state.stateName + "->" + name;

      do {
        if (state.exit) {
          state.exit(this);
        }
        state = state.parentState;
      } while (!state[pivotName]);

      var setups = void 0;
      var enters = void 0;
      var i = void 0;
      var l = void 0;
      var map = TransitionChainMap[transitionMapId];

      if (map) {
        setups = map.setups;
        enters = map.enters;
        state = map.state;
      } else {
        setups = [];
        enters = [];

        var path = splitOnDot(name);

        for (i = 0, l = path.length; i < l; i++) {
          state = state[path[i]];

          if (state.enter) {
            enters.push(state);
          }
          if (state.setup) {
            setups.push(state);
          }
        }

        TransitionChainMap[transitionMapId] = { setups: setups, enters: enters, state: state };
      }

      for (i = 0, l = enters.length; i < l; i++) {
        enters[i].enter(this);
      }

      this.currentState = state;
      if (this.hasRecord) {
        set(this.record, 'currentState', state);
      }

      for (i = 0, l = setups.length; i < l; i++) {
        setups[i].setup(this);
      }

      this.updateRecordArrays();
    };

    InternalModel.prototype._unhandledEvent = function _unhandledEvent(state, name, context) {
      var errorMessage = "Attempted to handle event `" + name + "` ";
      errorMessage += "on " + String(this) + " while in state ";
      errorMessage += state.stateName + ". ";

      if (context !== undefined) {
        errorMessage += "Called with " + inspect(context) + ".";
      }

      throw new EmberError(errorMessage);
    };

    InternalModel.prototype.triggerLater = function triggerLater() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (this._deferredTriggers.push(args) !== 1) {
        return;
      }

      this.store._updateInternalModel(this);
    };

    InternalModel.prototype._triggerDeferredTriggers = function _triggerDeferredTriggers() {
      //TODO: Before 1.0 we want to remove all the events that happen on the pre materialized record,
      //but for now, we queue up all the events triggered before the record was materialized, and flush
      //them once we have the record
      if (!this.hasRecord) {
        return;
      }
      for (var i = 0, l = this._deferredTriggers.length; i < l; i++) {
        this.record.trigger.apply(this.record, this._deferredTriggers[i]);
      }

      this._deferredTriggers.length = 0;
    };

    InternalModel.prototype.clearRelationships = function clearRelationships() {
      var _this2 = this;

      this.eachRelationship(function (name, relationship) {
        if (_this2._relationships.has(name)) {
          var rel = _this2._relationships.get(name);
          rel.clear();
          rel.destroy();
        }
      });
      Object.keys(this._implicitRelationships).forEach(function (key) {
        _this2._implicitRelationships[key].clear();
        _this2._implicitRelationships[key].destroy();
      });
    };

    InternalModel.prototype.destroyRelationships = function destroyRelationships() {
      var _this3 = this;

      this.eachRelationship(function (name, relationship) {
        if (_this3._relationships.has(name)) {
          var rel = _this3._relationships.get(name);
          rel.destroy();
        }
      });
      Object.keys(this._implicitRelationships).forEach(function (key) {
        _this3._implicitRelationships[key].destroy();
      });
    };

    InternalModel.prototype.preloadData = function preloadData(preload) {
      var _this4 = this;

      //TODO(Igor) consider the polymorphic case
      Object.keys(preload).forEach(function (key) {
        var preloadValue = get(preload, key);
        var relationshipMeta = _this4.modelClass.metaForProperty(key);
        if (relationshipMeta.isRelationship) {
          _this4._preloadRelationship(key, preloadValue);
        } else {
          _this4._data[key] = preloadValue;
        }
      });
    };

    InternalModel.prototype._preloadRelationship = function _preloadRelationship(key, preloadValue) {
      var relationshipMeta = this.modelClass.metaForProperty(key);
      var modelClass = relationshipMeta.type;
      if (relationshipMeta.kind === 'hasMany') {
        this._preloadHasMany(key, preloadValue, modelClass);
      } else {
        this._preloadBelongsTo(key, preloadValue, modelClass);
      }
    };

    InternalModel.prototype._preloadHasMany = function _preloadHasMany(key, preloadValue, modelClass) {
      (0, _debug.assert)("You need to pass in an array to set a hasMany property on a record", Array.isArray(preloadValue));
      var recordsToSet = new Array(preloadValue.length);

      for (var i = 0; i < preloadValue.length; i++) {
        var recordToPush = preloadValue[i];
        recordsToSet[i] = this._convertStringOrNumberIntoInternalModel(recordToPush, modelClass);
      }

      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).updateRecordsFromAdapter(recordsToSet);
    };

    InternalModel.prototype._preloadBelongsTo = function _preloadBelongsTo(key, preloadValue, modelClass) {
      var recordToSet = this._convertStringOrNumberIntoInternalModel(preloadValue, modelClass);

      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).setRecord(recordToSet);
    };

    InternalModel.prototype._convertStringOrNumberIntoInternalModel = function _convertStringOrNumberIntoInternalModel(value, modelClass) {
      if (typeof value === 'string' || typeof value === 'number') {
        return this.store._internalModelForId(modelClass, value);
      }
      if (value._internalModel) {
        return value._internalModel;
      }
      return value;
    };

    InternalModel.prototype.updateRecordArrays = function updateRecordArrays() {
      if (this._isUpdatingRecordArrays) {
        return;
      }
      this._isUpdatingRecordArrays = true;
      this.store.recordArrayManager.recordDidChange(this);
    };

    InternalModel.prototype.setId = function setId(id) {
      (0, _debug.assert)('A record\'s id cannot be changed once it is in the loaded state', this.id === null || this.id === id || this.isNew());
      this.id = id;
      if (this.record.get('id') !== id) {
        this.record.set('id', id);
      }
    };

    InternalModel.prototype.didError = function didError(error) {
      this.error = error;
      this.isError = true;

      if (this.hasRecord) {
        this.record.setProperties({
          isError: true,
          adapterError: error
        });
      }
    };

    InternalModel.prototype.didCleanError = function didCleanError() {
      this.error = null;
      this.isError = false;

      if (this.hasRecord) {
        this.record.setProperties({
          isError: false,
          adapterError: null
        });
      }
    };

    InternalModel.prototype.adapterDidCommit = function adapterDidCommit(data) {
      if (data) {
        data = data.attributes;
      }

      this.didCleanError();
      var changedKeys = this._changedKeys(data);

      assign(this._data, this._inFlightAttributes);
      if (data) {
        assign(this._data, data);
      }

      this._inFlightAttributes = Object.create(null);

      this.send('didCommit');
      this.updateRecordArrays();

      if (!data) {
        return;
      }

      this.record._notifyProperties(changedKeys);
    };

    InternalModel.prototype.addErrorMessageToAttribute = function addErrorMessageToAttribute(attribute, message) {
      get(this.getRecord(), 'errors')._add(attribute, message);
    };

    InternalModel.prototype.removeErrorMessageFromAttribute = function removeErrorMessageFromAttribute(attribute) {
      get(this.getRecord(), 'errors')._remove(attribute);
    };

    InternalModel.prototype.clearErrorMessages = function clearErrorMessages() {
      get(this.getRecord(), 'errors')._clear();
    };

    InternalModel.prototype.hasErrors = function hasErrors() {
      var errors = get(this.getRecord(), 'errors');

      return !isEmpty(errors);
    };

    InternalModel.prototype.adapterDidInvalidate = function adapterDidInvalidate(errors) {
      var attribute = void 0;

      for (attribute in errors) {
        if (errors.hasOwnProperty(attribute)) {
          this.addErrorMessageToAttribute(attribute, errors[attribute]);
        }
      }

      this.send('becameInvalid');

      this._saveWasRejected();
    };

    InternalModel.prototype.adapterDidError = function adapterDidError(error) {
      this.send('becameError');
      this.didError(error);
      this._saveWasRejected();
    };

    InternalModel.prototype._saveWasRejected = function _saveWasRejected() {
      var keys = Object.keys(this._inFlightAttributes);
      var attrs = this._attributes;
      for (var i = 0; i < keys.length; i++) {
        if (attrs[keys[i]] === undefined) {
          attrs[keys[i]] = this._inFlightAttributes[keys[i]];
        }
      }
      this._inFlightAttributes = Object.create(null);
    };

    InternalModel.prototype._changedKeys = function _changedKeys(updates) {
      var changedKeys = [];

      if (updates) {
        var original = void 0,
            i = void 0,
            value = void 0,
            key = void 0;
        var keys = Object.keys(updates);
        var length = keys.length;
        var attrs = this._attributes;

        original = assign(Object.create(null), this._data);
        original = assign(original, this._inFlightAttributes);

        for (i = 0; i < length; i++) {
          key = keys[i];
          value = updates[key];

          // A value in _attributes means the user has a local change to
          // this attributes. We never override this value when merging
          // updates from the backend so we should not sent a change
          // notification if the server value differs from the original.
          if (attrs[key] !== undefined) {
            continue;
          }

          if (!isEqual(original[key], value)) {
            changedKeys.push(key);
          }
        }
      }

      return changedKeys;
    };

    InternalModel.prototype.toString = function toString() {
      return "<" + this.modelName + ":" + this.id + ">";
    };

    InternalModel.prototype.referenceFor = function referenceFor(kind, name) {
      var _this5 = this;

      var reference = this.references[name];

      if (!reference) {
        var relationship = this._relationships.get(name);

        (0, _debug.runInDebug)(function () {
          var modelName = _this5.modelName;
          (0, _debug.assert)("There is no " + kind + " relationship named '" + name + "' on a model of modelClass '" + modelName + "'", relationship);

          var actualRelationshipKind = relationship.relationshipMeta.kind;
          (0, _debug.assert)("You tried to get the '" + name + "' relationship on a '" + modelName + "' via record." + kind + "('" + name + "'), but the relationship is of kind '" + actualRelationshipKind + "'. Use record." + actualRelationshipKind + "('" + name + "') instead.", actualRelationshipKind === kind);
        });

        if (kind === "belongsTo") {
          reference = new _references.BelongsToReference(this.store, this, relationship);
        } else if (kind === "hasMany") {
          reference = new _references.HasManyReference(this.store, this, relationship);
        }

        this.references[name] = reference;
      }

      return reference;
    };

    _createClass(InternalModel, [{
      key: "modelClass",
      get: function get() {
        return this._modelClass || (this._modelClass = this.store._modelFor(this.modelName));
      }
    }, {
      key: "type",
      get: function get() {
        return this.modelClass;
      }
    }, {
      key: "recordReference",
      get: function get() {
        if (this._recordReference === null) {
          this._recordReference = new _references.RecordReference(this.store, this);
        }
        return this._recordReference;
      }
    }, {
      key: "_recordArrays",
      get: function get() {
        if (this.__recordArrays === null) {
          this.__recordArrays = _orderedSet.default.create();
        }
        return this.__recordArrays;
      }
    }, {
      key: "references",
      get: function get() {
        if (this._references === null) {
          this._references = Object.create(null);
        }
        return this._references;
      }
    }, {
      key: "_deferredTriggers",
      get: function get() {
        if (this.__deferredTriggers === null) {
          this.__deferredTriggers = [];
        }
        return this.__deferredTriggers;
      }
    }, {
      key: "_attributes",
      get: function get() {
        if (this.__attributes === null) {
          this.__attributes = Object.create(null);
        }
        return this.__attributes;
      },
      set: function set(v) {
        this.__attributes = v;
      }
    }, {
      key: "_relationships",
      get: function get() {
        if (this.__relationships === null) {
          this.__relationships = new _create.default(this);
        }

        return this.__relationships;
      }
    }, {
      key: "_inFlightAttributes",
      get: function get() {
        if (this.__inFlightAttributes === null) {
          this.__inFlightAttributes = Object.create(null);
        }
        return this.__inFlightAttributes;
      },
      set: function set(v) {
        this.__inFlightAttributes = v;
      }
    }, {
      key: "_data",
      get: function get() {
        if (this.__data === null) {
          this.__data = Object.create(null);
        }
        return this.__data;
      },
      set: function set(v) {
        this.__data = v;
      }
    }, {
      key: "_implicitRelationships",
      get: function get() {
        if (this.__implicitRelationships === null) {
          this.__implicitRelationships = Object.create(null);
        }
        return this.__implicitRelationships;
      }
    }, {
      key: "record",
      get: function get() {
        return this._record;
      }
    }, {
      key: "isDestroyed",
      get: function get() {
        return this._isDestroyed;
      }
    }, {
      key: "hasRecord",
      get: function get() {
        return !!this._record;
      }
    }]);

    return InternalModel;
  }();

  exports.default = InternalModel;


  if ((0, _features.default)('ds-rollback-attribute')) {
    /*
       Returns the latest truth for an attribute - the canonical value, or the
       in-flight value.
        @method lastAcknowledgedValue
       @private
    */
    InternalModel.prototype.lastAcknowledgedValue = function lastAcknowledgedValue(key) {
      if (key in this._inFlightAttributes) {
        return this._inFlightAttributes[key];
      } else {
        return this._data[key];
      }
    };
  }
});