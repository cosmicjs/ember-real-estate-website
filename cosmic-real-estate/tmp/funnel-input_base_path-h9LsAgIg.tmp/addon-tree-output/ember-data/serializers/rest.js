define("ember-data/serializers/rest", ["exports", "ember", "ember-inflector", "ember-data/-private/debug", "ember-data/serializers/json", "ember-data/-private/system/normalize-model-name", "ember-data/-private/system/coerce-id", "ember-data/-private/utils", "ember-data/-private/features"], function (exports, _ember, _emberInflector, _debug, _json, _normalizeModelName, _coerceId, _utils, _features) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var camelize = _ember.default.String.camelize;

  /**
    Normally, applications will use the `RESTSerializer` by implementing
    the `normalize` method.
  
    This allows you to do whatever kind of munging you need, and is
    especially useful if your server is inconsistent and you need to
    do munging differently for many different kinds of responses.
  
    See the `normalize` documentation for more information.
  
    ## Across the Board Normalization
  
    There are also a number of hooks that you might find useful to define
    across-the-board rules for your payload. These rules will be useful
    if your server is consistent, or if you're building an adapter for
    an infrastructure service, like Firebase, and want to encode service
    conventions.
  
    For example, if all of your keys are underscored and all-caps, but
    otherwise consistent with the names you use in your models, you
    can implement across-the-board rules for how to convert an attribute
    name in your model to a key in your JSON.
  
    ```app/serializers/application.js
    import DS from 'ember-data';
  
    export default DS.RESTSerializer.extend({
      keyForAttribute(attr, method) {
        return Ember.String.underscore(attr).toUpperCase();
      }
    });
    ```
  
    You can also implement `keyForRelationship`, which takes the name
    of the relationship as the first parameter, the kind of
    relationship (`hasMany` or `belongsTo`) as the second parameter, and
    the method (`serialize` or `deserialize`) as the third parameter.
  
    @class RESTSerializer
    @namespace DS
    @extends DS.JSONSerializer
  */
  var RESTSerializer = _json.default.extend({
    keyForPolymorphicType: function keyForPolymorphicType(key, typeClass, method) {
      var relationshipKey = this.keyForRelationship(key);

      return relationshipKey + "Type";
    },
    normalize: function normalize(modelClass, resourceHash, prop) {
      if (this.normalizeHash && this.normalizeHash[prop]) {
        (0, _debug.deprecate)('`RESTSerializer.normalizeHash` has been deprecated. Please use `serializer.normalize` to modify the payload of single resources.', false, {
          id: 'ds.serializer.normalize-hash-deprecated',
          until: '3.0.0'
        });
        this.normalizeHash[prop](resourceHash);
      }
      return this._super(modelClass, resourceHash);
    },
    _normalizeArray: function _normalizeArray(store, modelName, arrayHash, prop) {
      var _this = this;

      var documentHash = {
        data: [],
        included: []
      };

      var modelClass = store.modelFor(modelName);
      var serializer = store.serializerFor(modelName);

      _ember.default.makeArray(arrayHash).forEach(function (hash) {
        var _normalizePolymorphic = _this._normalizePolymorphicRecord(store, hash, prop, modelClass, serializer),
            data = _normalizePolymorphic.data,
            included = _normalizePolymorphic.included;

        documentHash.data.push(data);
        if (included) {
          var _documentHash$include;

          (_documentHash$include = documentHash.included).push.apply(_documentHash$include, included);
        }
      });

      return documentHash;
    },
    _normalizePolymorphicRecord: function _normalizePolymorphicRecord(store, hash, prop, primaryModelClass, primarySerializer) {
      var serializer = primarySerializer;
      var modelClass = primaryModelClass;

      var primaryHasTypeAttribute = (0, _utils.modelHasAttributeOrRelationshipNamedType)(primaryModelClass);

      if (!primaryHasTypeAttribute && hash.type) {
        // Support polymorphic records in async relationships
        var modelName = void 0;
        if ((0, _features.default)("ds-payload-type-hooks")) {
          modelName = this.modelNameFromPayloadType(hash.type);
          var deprecatedModelNameLookup = this.modelNameFromPayloadKey(hash.type);

          if (modelName !== deprecatedModelNameLookup && !this._hasCustomModelNameFromPayloadType() && this._hasCustomModelNameFromPayloadKey()) {
            (0, _debug.deprecate)("You are using modelNameFromPayloadKey to normalize the type for a polymorphic relationship. This is has been deprecated in favor of modelNameFromPayloadType", false, {
              id: 'ds.rest-serializer.deprecated-model-name-for-polymorphic-type',
              until: '3.0.0'
            });

            modelName = deprecatedModelNameLookup;
          }
        } else {
          modelName = this.modelNameFromPayloadKey(hash.type);
        }

        if (store._hasModelFor(modelName)) {
          serializer = store.serializerFor(modelName);
          modelClass = store.modelFor(modelName);
        }
      }

      return serializer.normalize(modelClass, hash, prop);
    },
    _normalizeResponse: function _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var _this2 = this;

      var documentHash = {
        data: null,
        included: []
      };

      var meta = this.extractMeta(store, primaryModelClass, payload);
      if (meta) {
        (0, _debug.assert)('The `meta` returned from `extractMeta` has to be an object, not "' + _ember.default.typeOf(meta) + '".', _ember.default.typeOf(meta) === 'object');
        documentHash.meta = meta;
      }

      var keys = Object.keys(payload);

      var _loop = function _loop(i, length) {
        var prop = keys[i];
        var modelName = prop;
        var forcedSecondary = false;

        /*
          If you want to provide sideloaded records of the same type that the
          primary data you can do that by prefixing the key with `_`.
           Example
           ```
          {
            users: [
              { id: 1, title: 'Tom', manager: 3 },
              { id: 2, title: 'Yehuda', manager: 3 }
            ],
            _users: [
              { id: 3, title: 'Tomster' }
            ]
          }
          ```
           This forces `_users` to be added to `included` instead of `data`.
         */
        if (prop.charAt(0) === '_') {
          forcedSecondary = true;
          modelName = prop.substr(1);
        }

        var typeName = _this2.modelNameFromPayloadKey(modelName);
        if (!store.modelFactoryFor(typeName)) {
          (0, _debug.warn)(_this2.warnMessageNoModelForKey(modelName, typeName), false, {
            id: 'ds.serializer.model-for-key-missing'
          });
          return "continue";
        }

        var isPrimary = !forcedSecondary && _this2.isPrimaryType(store, typeName, primaryModelClass);
        var value = payload[prop];

        if (value === null) {
          return "continue";
        }

        (0, _debug.runInDebug)(function () {
          var isQueryRecordAnArray = requestType === 'queryRecord' && isPrimary && Array.isArray(value);
          var message = "The adapter returned an array for the primary data of a `queryRecord` response. This is deprecated as `queryRecord` should return a single record.";

          (0, _debug.deprecate)(message, !isQueryRecordAnArray, {
            id: 'ds.serializer.rest.queryRecord-array-response',
            until: '3.0'
          });
        });

        /*
          Support primary data as an object instead of an array.
           Example
           ```
          {
            user: { id: 1, title: 'Tom', manager: 3 }
          }
          ```
         */
        if (isPrimary && _ember.default.typeOf(value) !== 'array') {
          var _normalizePolymorphic2 = _this2._normalizePolymorphicRecord(store, value, prop, primaryModelClass, _this2),
              _data = _normalizePolymorphic2.data,
              _included = _normalizePolymorphic2.included;

          documentHash.data = _data;
          if (_included) {
            var _documentHash$include2;

            (_documentHash$include2 = documentHash.included).push.apply(_documentHash$include2, _included);
          }
          return "continue";
        }

        var _normalizeArray2 = _this2._normalizeArray(store, typeName, value, prop),
            data = _normalizeArray2.data,
            included = _normalizeArray2.included;

        if (included) {
          var _documentHash$include3;

          (_documentHash$include3 = documentHash.included).push.apply(_documentHash$include3, included);
        }

        if (isSingle) {
          data.forEach(function (resource) {

            /*
              Figures out if this is the primary record or not.
               It's either:
               1. The record with the same ID as the original request
              2. If it's a newly created record without an ID, the first record
                 in the array
             */
            var isUpdatedRecord = isPrimary && (0, _coerceId.default)(resource.id) === id;
            var isFirstCreatedRecord = isPrimary && !id && !documentHash.data;

            if (isFirstCreatedRecord || isUpdatedRecord) {
              documentHash.data = resource;
            } else {
              documentHash.included.push(resource);
            }
          });
        } else {
          if (isPrimary) {
            documentHash.data = data;
          } else {
            if (data) {
              var _documentHash$include4;

              (_documentHash$include4 = documentHash.included).push.apply(_documentHash$include4, data);
            }
          }
        }
      };

      for (var i = 0, length = keys.length; i < length; i++) {
        var _ret = _loop(i, length);

        if (_ret === "continue") continue;
      }

      return documentHash;
    },
    isPrimaryType: function isPrimaryType(store, typeName, primaryTypeClass) {
      return store.modelFor(typeName) === primaryTypeClass;
    },
    pushPayload: function pushPayload(store, payload) {
      var _this3 = this;

      var documentHash = {
        data: [],
        included: []
      };

      var _loop2 = function _loop2(_prop) {
        var modelName = _this3.modelNameFromPayloadKey(_prop);
        if (!store.modelFactoryFor(modelName)) {
          (0, _debug.warn)(_this3.warnMessageNoModelForKey(_prop, modelName), false, {
            id: 'ds.serializer.model-for-key-missing'
          });
          return "continue";
        }
        var type = store.modelFor(modelName);
        var typeSerializer = store.serializerFor(type.modelName);

        _ember.default.makeArray(payload[_prop]).forEach(function (hash) {
          var _typeSerializer$norma = typeSerializer.normalize(type, hash, _prop),
              data = _typeSerializer$norma.data,
              included = _typeSerializer$norma.included;

          documentHash.data.push(data);
          if (included) {
            var _documentHash$include5;

            (_documentHash$include5 = documentHash.included).push.apply(_documentHash$include5, included);
          }
        });
      };

      for (var _prop in payload) {
        var _ret2 = _loop2(_prop);

        if (_ret2 === "continue") continue;
      }

      if ((0, _features.default)('ds-pushpayload-return')) {
        return store.push(documentHash);
      } else {
        store.push(documentHash);
      }
    },
    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return (0, _emberInflector.singularize)((0, _normalizeModelName.default)(key));
    },
    serialize: function serialize(snapshot, options) {
      return this._super.apply(this, arguments);
    },
    serializeIntoHash: function serializeIntoHash(hash, typeClass, snapshot, options) {
      var normalizedRootKey = this.payloadKeyFromModelName(typeClass.modelName);
      hash[normalizedRootKey] = this.serialize(snapshot, options);
    },
    payloadKeyFromModelName: function payloadKeyFromModelName(modelName) {
      return camelize(modelName);
    },
    serializePolymorphicType: function serializePolymorphicType(snapshot, json, relationship) {
      var key = relationship.key;
      var typeKey = this.keyForPolymorphicType(key, relationship.type, 'serialize');
      var belongsTo = snapshot.belongsTo(key);

      // old way of getting the key for the polymorphic type
      key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;
      key = key + "Type";

      // The old way of serializing the type of a polymorphic record used
      // `keyForAttribute`, which is not correct. The next code checks if the old
      // way is used and if it differs from the new way of using
      // `keyForPolymorphicType`. If this is the case, a deprecation warning is
      // logged and the old way is restored (so nothing breaks).
      if (key !== typeKey && this.keyForPolymorphicType === RESTSerializer.prototype.keyForPolymorphicType) {
        (0, _debug.deprecate)("The key to serialize the type of a polymorphic record is created via keyForAttribute which has been deprecated. Use the keyForPolymorphicType hook instead.", false, {
          id: 'ds.rest-serializer.deprecated-key-for-polymorphic-type',
          until: '3.0.0'
        });

        typeKey = key;
      }

      if (_ember.default.isNone(belongsTo)) {
        json[typeKey] = null;
      } else {
        if ((0, _features.default)("ds-payload-type-hooks")) {
          json[typeKey] = this.payloadTypeFromModelName(belongsTo.modelName);
        } else {
          json[typeKey] = camelize(belongsTo.modelName);
        }
      }
    },
    extractPolymorphicRelationship: function extractPolymorphicRelationship(relationshipType, relationshipHash, relationshipOptions) {
      var key = relationshipOptions.key,
          resourceHash = relationshipOptions.resourceHash,
          relationshipMeta = relationshipOptions.relationshipMeta;


      // A polymorphic belongsTo relationship can be present in the payload
      // either in the form where the `id` and the `type` are given:
      //
      //   {
      //     message: { id: 1, type: 'post' }
      //   }
      //
      // or by the `id` and a `<relationship>Type` attribute:
      //
      //   {
      //     message: 1,
      //     messageType: 'post'
      //   }
      //
      // The next code checks if the latter case is present and returns the
      // corresponding JSON-API representation. The former case is handled within
      // the base class JSONSerializer.
      var isPolymorphic = relationshipMeta.options.polymorphic;
      var typeProperty = this.keyForPolymorphicType(key, relationshipType, 'deserialize');

      if (isPolymorphic && resourceHash[typeProperty] !== undefined && (typeof relationshipHash === "undefined" ? "undefined" : _typeof(relationshipHash)) !== 'object') {

        if ((0, _features.default)("ds-payload-type-hooks")) {

          var payloadType = resourceHash[typeProperty];
          var _type = this.modelNameFromPayloadType(payloadType);
          var deprecatedTypeLookup = this.modelNameFromPayloadKey(payloadType);

          if (payloadType !== deprecatedTypeLookup && !this._hasCustomModelNameFromPayloadType() && this._hasCustomModelNameFromPayloadKey()) {
            (0, _debug.deprecate)("You are using modelNameFromPayloadKey to normalize the type for a polymorphic relationship. This has been deprecated in favor of modelNameFromPayloadType", false, {
              id: 'ds.rest-serializer.deprecated-model-name-for-polymorphic-type',
              until: '3.0.0'
            });

            _type = deprecatedTypeLookup;
          }

          return {
            id: relationshipHash,
            type: _type
          };
        } else {

          var _type2 = this.modelNameFromPayloadKey(resourceHash[typeProperty]);
          return {
            id: relationshipHash,
            type: _type2
          };
        }
      }

      return this._super.apply(this, arguments);
    }
  });

  if ((0, _features.default)("ds-payload-type-hooks")) {

    RESTSerializer.reopen({
      modelNameFromPayloadType: function modelNameFromPayloadType(payloadType) {
        return (0, _emberInflector.singularize)((0, _normalizeModelName.default)(payloadType));
      },
      payloadTypeFromModelName: function payloadTypeFromModelName(modelName) {
        return camelize(modelName);
      },
      _hasCustomModelNameFromPayloadKey: function _hasCustomModelNameFromPayloadKey() {
        return this.modelNameFromPayloadKey !== RESTSerializer.prototype.modelNameFromPayloadKey;
      },
      _hasCustomModelNameFromPayloadType: function _hasCustomModelNameFromPayloadType() {
        return this.modelNameFromPayloadType !== RESTSerializer.prototype.modelNameFromPayloadType;
      },
      _hasCustomPayloadTypeFromModelName: function _hasCustomPayloadTypeFromModelName() {
        return this.payloadTypeFromModelName !== RESTSerializer.prototype.payloadTypeFromModelName;
      },
      _hasCustomPayloadKeyFromModelName: function _hasCustomPayloadKeyFromModelName() {
        return this.payloadKeyFromModelName !== RESTSerializer.prototype.payloadKeyFromModelName;
      }
    });
  }

  (0, _debug.runInDebug)(function () {
    RESTSerializer.reopen({
      warnMessageNoModelForKey: function warnMessageNoModelForKey(prop, typeKey) {
        return 'Encountered "' + prop + '" in payload, but no model was found for model name "' + typeKey + '" (resolved model name using ' + this.constructor.toString() + '.modelNameFromPayloadKey("' + prop + '"))';
      }
    });
  });

  exports.default = RESTSerializer;
});