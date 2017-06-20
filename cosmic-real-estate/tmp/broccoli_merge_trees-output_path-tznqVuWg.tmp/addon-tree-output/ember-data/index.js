define("ember-data/index", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/features", "ember-data/-private/global", "ember-data/-private/core", "ember-data/-private/system/normalize-model-name", "ember-data/-private/system/model/internal-model", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/store", "ember-data/-private/system/model", "ember-data/model", "ember-data/-private/system/snapshot", "ember-data/adapter", "ember-data/serializer", "ember-data/adapters/errors", "ember-data/-private/system/record-arrays", "ember-data/-private/system/many-array", "ember-data/-private/system/record-array-manager", "ember-data/-private/adapters", "ember-data/-private/adapters/build-url-mixin", "ember-data/-private/serializers", "ember-data/serializers/embedded-records-mixin", "ember-data/-private/transforms", "ember-data/relationships", "ember-data/setup-container", "ember-data/-private/instance-initializers/initialize-store-service", "ember-data/-private/system/relationships/state/relationship", "ember-inflector"], function (exports, _ember, _debug, _features, _global, _core, _normalizeModelName, _internalModel, _promiseProxies, _store, _model, _model2, _snapshot, _adapter, _serializer, _errors, _recordArrays, _manyArray, _recordArrayManager, _adapters, _buildUrlMixin, _serializers, _embeddedRecordsMixin, _transforms, _relationships, _setupContainer, _initializeStoreService, _relationship) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
    Ember Data
    @module ember-data
    @main ember-data
  */

  if (_ember.default.VERSION.match(/^1\.([0-9]|1[0-2])\./)) {
    throw new _ember.default.Error("Ember Data requires at least Ember 1.13.0, but you have " + _ember.default.VERSION + ". Please upgrade your version of Ember, then upgrade Ember Data.");
  }

  _core.default.Store = _store.Store;
  _core.default.PromiseArray = _promiseProxies.PromiseArray;
  _core.default.PromiseObject = _promiseProxies.PromiseObject;

  _core.default.PromiseManyArray = _promiseProxies.PromiseManyArray;

  _core.default.Model = _model2.default;
  _core.default.RootState = _model.RootState;
  _core.default.attr = _model.attr;
  _core.default.Errors = _model.Errors;

  _core.default.InternalModel = _internalModel.default;
  _core.default.Snapshot = _snapshot.default;

  _core.default.Adapter = _adapter.default;

  _core.default.AdapterError = _errors.AdapterError;
  _core.default.InvalidError = _errors.InvalidError;
  _core.default.TimeoutError = _errors.TimeoutError;
  _core.default.AbortError = _errors.AbortError;

  if (true) {
    _core.default.UnauthorizedError = _errors.UnauthorizedError;
    _core.default.ForbiddenError = _errors.ForbiddenError;
    _core.default.NotFoundError = _errors.NotFoundError;
    _core.default.ConflictError = _errors.ConflictError;
    _core.default.ServerError = _errors.ServerError;
  }

  _core.default.errorsHashToArray = _errors.errorsHashToArray;
  _core.default.errorsArrayToHash = _errors.errorsArrayToHash;

  _core.default.Serializer = _serializer.default;

  _core.default.DebugAdapter = _debug.default;

  _core.default.RecordArray = _recordArrays.RecordArray;
  _core.default.FilteredRecordArray = _recordArrays.FilteredRecordArray;
  _core.default.AdapterPopulatedRecordArray = _recordArrays.AdapterPopulatedRecordArray;
  _core.default.ManyArray = _manyArray.default;

  _core.default.RecordArrayManager = _recordArrayManager.default;

  _core.default.RESTAdapter = _adapters.RESTAdapter;
  _core.default.BuildURLMixin = _buildUrlMixin.default;

  _core.default.RESTSerializer = _serializers.RESTSerializer;
  _core.default.JSONSerializer = _serializers.JSONSerializer;

  _core.default.JSONAPIAdapter = _adapters.JSONAPIAdapter;
  _core.default.JSONAPISerializer = _serializers.JSONAPISerializer;

  _core.default.Transform = _transforms.Transform;
  _core.default.DateTransform = _transforms.DateTransform;
  _core.default.StringTransform = _transforms.StringTransform;
  _core.default.NumberTransform = _transforms.NumberTransform;
  _core.default.BooleanTransform = _transforms.BooleanTransform;

  _core.default.EmbeddedRecordsMixin = _embeddedRecordsMixin.default;

  _core.default.belongsTo = _relationships.belongsTo;
  _core.default.hasMany = _relationships.hasMany;

  _core.default.Relationship = _relationship.default;

  _core.default._setupContainer = _setupContainer.default;
  _core.default._initializeStoreService = _initializeStoreService.default;

  Object.defineProperty(_core.default, 'normalizeModelName', {
    enumerable: true,
    writable: false,
    configurable: false,
    value: _normalizeModelName.default
  });

  Object.defineProperty(_global.default, 'DS', {
    configurable: true,
    get: function get() {
      (0, _debug.deprecate)('Using the global version of DS is deprecated. Please either import ' + 'the specific modules needed or `import DS from \'ember-data\';`.', false, { id: 'ember-data.global-ds', until: '3.0.0' });

      return _core.default;
    }
  });

  exports.default = _core.default;
});