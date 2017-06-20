define('ember-data/-private/system/internal-model-map', ['exports', 'ember-data/-private/debug', 'ember-data/-private/system/model/internal-model'], function (exports, _debug, _internalModel) {
  'use strict';

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

  var InternalModelMap = function () {
    function InternalModelMap(modelName) {
      _classCallCheck(this, InternalModelMap);

      this.modelName = modelName;
      this._idToModel = Object.create(null);
      this._models = [];
      this._metadata = null;
    }

    /**
      A "map" of records based on their ID for this modelName
     */


    InternalModelMap.prototype.get = function get(id) {
      var r = this._idToModel[id];
      return r;
    };

    InternalModelMap.prototype.has = function has(id) {
      return !!this._idToModel[id];
    };

    InternalModelMap.prototype.set = function set(id, internalModel) {
      (0, _debug.assert)('You cannot index an internalModel by an empty id\'', id);
      (0, _debug.assert)('You cannot set an index for an internalModel to something other than an internalModel', internalModel instanceof _internalModel.default);
      (0, _debug.assert)('You cannot set an index for an internalModel that is not in the InternalModelMap', this.contains(internalModel));
      (0, _debug.assert)('You cannot update the id index of an InternalModel once set. Attempted to update ' + id + '.', !this.has(id) || this.get(id) === internalModel);

      this._idToModel[id] = internalModel;
    };

    InternalModelMap.prototype.add = function add(internalModel, id) {
      (0, _debug.assert)('You cannot re-add an already present InternalModel to the InternalModelMap.', !this.contains(internalModel));

      if (id) {
        this._idToModel[id] = internalModel;
      }

      this._models.push(internalModel);
    };

    InternalModelMap.prototype.remove = function remove(internalModel, id) {
      if (id) {
        delete this._idToModel[id];
      }

      var loc = this._models.indexOf(internalModel);

      if (loc !== -1) {
        this._models.splice(loc, 1);
      }
    };

    InternalModelMap.prototype.contains = function contains(internalModel) {
      return this._models.indexOf(internalModel) !== -1;
    };

    InternalModelMap.prototype.clear = function clear() {
      if (this._models) {
        var models = this._models;
        this._models = [];

        for (var i = 0; i < models.length; i++) {
          var model = models[i];
          model.unloadRecord();
        }
      }

      this._metadata = null;
    };

    InternalModelMap.prototype.destroy = function destroy() {
      this._store = null;
      this._modelClass = null;
    };

    _createClass(InternalModelMap, [{
      key: 'idToRecord',
      get: function get() {
        (0, _debug.deprecate)('Use of InternalModelMap.idToRecord is deprecated, use InternalModelMap.get(id) instead.', false, {
          id: 'ds.record-map.idToRecord',
          until: '2.13'
        });
        return this._idToModel;
      }
    }, {
      key: 'length',
      get: function get() {
        return this._models.length;
      }
    }, {
      key: 'models',
      get: function get() {
        return this._models;
      }
    }, {
      key: 'metadata',
      get: function get() {
        return this._metadata || (this._metadata = Object.create(null));
      }
    }, {
      key: 'type',
      get: function get() {
        throw new Error('InternalModelMap.type is no longer available');
      }
    }]);

    return InternalModelMap;
  }();

  exports.default = InternalModelMap;
});