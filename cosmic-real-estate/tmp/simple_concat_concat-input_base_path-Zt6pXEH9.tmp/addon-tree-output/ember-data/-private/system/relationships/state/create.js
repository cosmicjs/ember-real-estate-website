define("ember-data/-private/system/relationships/state/create", ["exports", "ember", "ember-data/-private/system/relationships/state/has-many", "ember-data/-private/system/relationships/state/belongs-to", "ember-data/-private/debug"], function (exports, _ember, _hasMany, _belongsTo, _debug) {
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

  var _get = _ember.default.get;


  function shouldFindInverse(relationshipMeta) {
    var options = relationshipMeta.options;
    return !(options && options.inverse === null);
  }

  function createRelationshipFor(internalModel, relationshipMeta, store) {
    var inverseKey = void 0;
    var inverse = null;

    if (shouldFindInverse(relationshipMeta)) {
      inverse = internalModel.type.inverseFor(relationshipMeta.key, store);
    } else {
      (0, _debug.runInDebug)(function () {
        internalModel.type.typeForRelationship(relationshipMeta.key, store);
      });
    }

    if (inverse) {
      inverseKey = inverse.name;
    }

    if (relationshipMeta.kind === 'hasMany') {
      return new _hasMany.default(store, internalModel, inverseKey, relationshipMeta);
    } else {
      return new _belongsTo.default(store, internalModel, inverseKey, relationshipMeta);
    }
  }

  var Relationships = function () {
    function Relationships(internalModel) {
      _classCallCheck(this, Relationships);

      this.internalModel = internalModel;
      this.initializedRelationships = Object.create(null);
    }

    // TODO @runspired deprecate this as it was never truly a record instance


    Relationships.prototype.has = function has(key) {
      return !!this.initializedRelationships[key];
    };

    Relationships.prototype.get = function get(key) {
      var relationships = this.initializedRelationships;
      var relationship = relationships[key];

      if (!relationship) {
        var internalModel = this.internalModel;
        var relationshipsByName = _get(internalModel.type, 'relationshipsByName');
        var rel = relationshipsByName.get(key);

        if (rel) {
          relationship = relationships[key] = createRelationshipFor(internalModel, rel, internalModel.store);
        }
      }

      return relationship;
    };

    _createClass(Relationships, [{
      key: "record",
      get: function get() {
        return this.internalModel;
      }
    }]);

    return Relationships;
  }();

  exports.default = Relationships;
});