define('ember-data/-private/system/record-array-manager', ['exports', 'ember', 'ember-data/-private/system/record-arrays', 'ember-data/-private/debug'], function (exports, _ember, _recordArrays, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var get = _ember.default.get,
      MapWithDefault = _ember.default.MapWithDefault,
      emberRun = _ember.default.run;

  var RecordArrayManager = function () {
    function RecordArrayManager(options) {
      var _this = this;

      _classCallCheck(this, RecordArrayManager);

      this.store = options.store;
      this.isDestroying = false;
      this.isDestroyed = false;
      this.filteredRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue() {
          return [];
        }
      });

      this.liveRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue(modelName) {
          (0, _debug.assert)('liveRecordArrays.get expects modelName not modelClass as the param', typeof modelName === 'string');
          return _this.createRecordArray(modelName);
        }
      });

      this.changedRecords = [];
      this.loadedRecords = [];
      this._adapterPopulatedRecordArrays = [];
    }

    RecordArrayManager.prototype.recordDidChange = function recordDidChange(internalModel) {
      if (this.changedRecords.push(internalModel) !== 1) {
        return;
      }

      emberRun.schedule('actions', this, this.updateRecordArrays);
    };

    RecordArrayManager.prototype.recordArraysForRecord = function recordArraysForRecord(internalModel) {

      return internalModel._recordArrays;
    };

    RecordArrayManager.prototype.updateRecordArrays = function updateRecordArrays() {
      var updated = this.changedRecords;

      for (var i = 0, l = updated.length; i < l; i++) {
        var internalModel = updated[i];

        // During dematerialization we don't want to rematerialize the record.
        // recordWasDeleted can cause other records to rematerialize because it
        // removes the internal model from the array and Ember arrays will always
        // `objectAt(0)` and `objectAt(len -1)` to check whether `firstObject` or
        // `lastObject` have changed.  When this happens we don't want those
        // models to rematerialize their records.
        if (internalModel._isDematerializing || internalModel.isDestroyed || internalModel.currentState.stateName === 'root.deleted.saved') {
          this._recordWasDeleted(internalModel);
        } else {
          this._recordWasChanged(internalModel);
        }

        internalModel._isUpdatingRecordArrays = false;
      }

      updated.length = 0;
    };

    RecordArrayManager.prototype._recordWasDeleted = function _recordWasDeleted(internalModel) {
      var recordArrays = internalModel.__recordArrays;

      if (!recordArrays) {
        return;
      }

      recordArrays.forEach(function (array) {
        return array._removeInternalModels([internalModel]);
      });

      internalModel.__recordArrays = null;
    };

    RecordArrayManager.prototype._recordWasChanged = function _recordWasChanged(internalModel) {
      var _this2 = this;

      var modelName = internalModel.modelName;
      var recordArrays = this.filteredRecordArrays.get(modelName);
      var filter = void 0;
      recordArrays.forEach(function (array) {
        filter = get(array, 'filterFunction');
        _this2.updateFilterRecordArray(array, filter, modelName, internalModel);
      });
    };

    RecordArrayManager.prototype.recordWasLoaded = function recordWasLoaded(internalModel) {
      if (this.loadedRecords.push(internalModel) !== 1) {
        return;
      }

      emberRun.schedule('actions', this, this._flushLoadedRecords);
    };

    RecordArrayManager.prototype._flushLoadedRecords = function _flushLoadedRecords() {
      var internalModels = this.loadedRecords;

      for (var i = 0, l = internalModels.length; i < l; i++) {
        var internalModel = internalModels[i];
        var modelName = internalModel.modelName;

        var recordArrays = this.filteredRecordArrays.get(modelName);
        var filter = void 0;

        for (var j = 0, rL = recordArrays.length; j < rL; j++) {
          var array = recordArrays[j];
          filter = get(array, 'filterFunction');
          this.updateFilterRecordArray(array, filter, modelName, internalModel);
        }

        if (this.liveRecordArrays.has(modelName)) {
          var liveRecordArray = this.liveRecordArrays.get(modelName);
          this._addInternalModelToRecordArray(liveRecordArray, internalModel);
        }
      }

      this.loadedRecords.length = 0;
    };

    RecordArrayManager.prototype.updateFilterRecordArray = function updateFilterRecordArray(array, filter, modelName, internalModel) {
      var shouldBeInArray = filter(internalModel.getRecord());
      var recordArrays = this.recordArraysForRecord(internalModel);
      if (shouldBeInArray) {
        this._addInternalModelToRecordArray(array, internalModel);
      } else {
        recordArrays.delete(array);
        array._removeInternalModels([internalModel]);
      }
    };

    RecordArrayManager.prototype._addInternalModelToRecordArray = function _addInternalModelToRecordArray(array, internalModel) {
      var recordArrays = this.recordArraysForRecord(internalModel);
      if (!recordArrays.has(array)) {
        array._pushInternalModels([internalModel]);
        recordArrays.add(array);
      }
    };

    RecordArrayManager.prototype.syncLiveRecordArray = function syncLiveRecordArray(array, modelName) {
      (0, _debug.assert)('recordArrayManger.syncLiveRecordArray expects modelName not modelClass as the second param', typeof modelName === 'string');
      var hasNoPotentialDeletions = this.changedRecords.length === 0;
      var map = this.store._internalModelsFor(modelName);
      var hasNoInsertionsOrRemovals = map.length === array.length;

      /*
        Ideally the recordArrayManager has knowledge of the changes to be applied to
        liveRecordArrays, and is capable of strategically flushing those changes and applying
        small diffs if desired.  However, until we've refactored recordArrayManager, this dirty
        check prevents us from unnecessarily wiping out live record arrays returned by peekAll.
       */
      if (hasNoPotentialDeletions && hasNoInsertionsOrRemovals) {
        return;
      }

      this.populateLiveRecordArray(array, modelName);
    };

    RecordArrayManager.prototype.populateLiveRecordArray = function populateLiveRecordArray(array, modelName) {
      (0, _debug.assert)('recordArrayManger.populateLiveRecordArray expects modelName not modelClass as the second param', typeof modelName === 'string');

      var modelMap = this.store._internalModelsFor(modelName);
      var internalModels = modelMap.models;

      for (var i = 0; i < internalModels.length; i++) {
        var internalModel = internalModels[i];

        if (!internalModel.isDeleted() && !internalModel.isEmpty()) {
          this._addInternalModelToRecordArray(array, internalModel);
        }
      }
    };

    RecordArrayManager.prototype.updateFilter = function updateFilter(array, modelName, filter) {
      (0, _debug.assert)('recordArrayManger.updateFilter expects modelName not modelClass as the second param, received ' + modelName, typeof modelName === 'string');

      var modelMap = this.store._internalModelsFor(modelName);
      var internalModels = modelMap.models;

      for (var i = 0; i < internalModels.length; i++) {
        var internalModel = internalModels[i];

        if (!internalModel.isDeleted() && !internalModel.isEmpty()) {
          this.updateFilterRecordArray(array, filter, modelName, internalModel);
        }
      }
    };

    RecordArrayManager.prototype.liveRecordArrayFor = function liveRecordArrayFor(modelName) {
      (0, _debug.assert)('recordArrayManger.liveRecordArrayFor expects modelName not modelClass as the param', typeof modelName === 'string');

      return this.liveRecordArrays.get(modelName);
    };

    RecordArrayManager.prototype.createRecordArray = function createRecordArray(modelName) {
      (0, _debug.assert)('recordArrayManger.createRecordArray expects modelName not modelClass as the param', typeof modelName === 'string');

      return _recordArrays.RecordArray.create({
        modelName: modelName,
        content: _ember.default.A(),
        store: this.store,
        isLoaded: true,
        manager: this
      });
    };

    RecordArrayManager.prototype.createFilteredRecordArray = function createFilteredRecordArray(modelName, filter, query) {
      (0, _debug.assert)('recordArrayManger.createFilteredRecordArray expects modelName not modelClass as the first param, received ' + modelName, typeof modelName === 'string');

      var array = _recordArrays.FilteredRecordArray.create({
        query: query,
        modelName: modelName,
        content: _ember.default.A(),
        store: this.store,
        manager: this,
        filterFunction: filter
      });

      this.registerFilteredRecordArray(array, modelName, filter);

      return array;
    };

    RecordArrayManager.prototype.createAdapterPopulatedRecordArray = function createAdapterPopulatedRecordArray(modelName, query) {
      (0, _debug.assert)('recordArrayManger.createAdapterPopulatedRecordArray expects modelName not modelClass as the first param, received ' + modelName, typeof modelName === 'string');

      var array = _recordArrays.AdapterPopulatedRecordArray.create({
        modelName: modelName,
        query: query,
        content: _ember.default.A(),
        store: this.store,
        manager: this
      });

      this._adapterPopulatedRecordArrays.push(array);

      return array;
    };

    RecordArrayManager.prototype.registerFilteredRecordArray = function registerFilteredRecordArray(array, modelName, filter) {
      (0, _debug.assert)('recordArrayManger.registerFilteredRecordArray expects modelName not modelClass as the second param, received ' + modelName, typeof modelName === 'string');

      var recordArrays = this.filteredRecordArrays.get(modelName);
      recordArrays.push(array);

      this.updateFilter(array, modelName, filter);
    };

    RecordArrayManager.prototype.unregisterRecordArray = function unregisterRecordArray(array) {

      var modelName = array.modelName;

      // unregister filtered record array
      var recordArrays = this.filteredRecordArrays.get(modelName);
      var removedFromFiltered = remove(recordArrays, array);

      // remove from adapter populated record array
      var removedFromAdapterPopulated = remove(this._adapterPopulatedRecordArrays, array);

      if (!removedFromFiltered && !removedFromAdapterPopulated) {

        // unregister live record array
        if (this.liveRecordArrays.has(modelName)) {
          var liveRecordArrayForType = this.liveRecordArrayFor(modelName);
          if (array === liveRecordArrayForType) {
            this.liveRecordArrays.delete(modelName);
          }
        }
      }
    };

    RecordArrayManager.prototype.willDestroy = function willDestroy() {
      this.filteredRecordArrays.forEach(function (value) {
        return flatten(value).forEach(destroy);
      });
      this.liveRecordArrays.forEach(destroy);
      this._adapterPopulatedRecordArrays.forEach(destroy);
      this.isDestroyed = true;
    };

    RecordArrayManager.prototype.destroy = function destroy() {
      this.isDestroying = true;
      _ember.default.run.schedule('actions', this, this.willDestroy);
    };

    return RecordArrayManager;
  }();

  exports.default = RecordArrayManager;


  function destroy(entry) {
    entry.destroy();
  }

  function flatten(list) {
    var length = list.length;
    var result = [];

    for (var i = 0; i < length; i++) {
      result = result.concat(list[i]);
    }

    return result;
  }

  function remove(array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }

    return false;
  }
});