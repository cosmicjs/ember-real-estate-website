define("ember-data/-private/system/relationships/state/belongs-to", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/relationships/state/relationship"], function (exports, _ember, _debug, _promiseProxies, _relationship) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var BelongsToRelationship = function (_Relationship) {
    _inherits(BelongsToRelationship, _Relationship);

    function BelongsToRelationship(store, internalModel, inverseKey, relationshipMeta) {
      _classCallCheck(this, BelongsToRelationship);

      var _this = _possibleConstructorReturn(this, _Relationship.call(this, store, internalModel, inverseKey, relationshipMeta));

      _this.internalModel = internalModel;
      _this.key = relationshipMeta.key;
      _this.inverseRecord = null;
      _this.canonicalState = null;
      return _this;
    }

    BelongsToRelationship.prototype.setRecord = function setRecord(newRecord) {
      if (newRecord) {
        this.addRecord(newRecord);
      } else if (this.inverseRecord) {
        this.removeRecord(this.inverseRecord);
      }
      this.setHasData(true);
      this.setHasLoaded(true);
    };

    BelongsToRelationship.prototype.setCanonicalRecord = function setCanonicalRecord(newRecord) {
      if (newRecord) {
        this.addCanonicalRecord(newRecord);
      } else if (this.canonicalState) {
        this.removeCanonicalRecord(this.canonicalState);
      }
      this.flushCanonicalLater();
    };

    BelongsToRelationship.prototype.addCanonicalRecord = function addCanonicalRecord(newRecord) {
      if (this.canonicalMembers.has(newRecord)) {
        return;
      }

      if (this.canonicalState) {
        this.removeCanonicalRecord(this.canonicalState);
      }

      this.canonicalState = newRecord;
      _Relationship.prototype.addCanonicalRecord.call(this, newRecord);
    };

    BelongsToRelationship.prototype.inverseDidDematerialize = function inverseDidDematerialize() {
      this.notifyBelongsToChanged();
    };

    BelongsToRelationship.prototype.flushCanonical = function flushCanonical() {
      //temporary fix to not remove newly created records if server returned null.
      //TODO remove once we have proper diffing
      if (this.inverseRecord && this.inverseRecord.isNew() && !this.canonicalState) {
        return;
      }
      if (this.inverseRecord !== this.canonicalState) {
        this.inverseRecord = this.canonicalState;
        this.notifyBelongsToChanged();
      }

      _Relationship.prototype.flushCanonical.call(this);
    };

    BelongsToRelationship.prototype.addRecord = function addRecord(newRecord) {
      if (this.members.has(newRecord)) {
        return;
      }

      (0, _debug.assertPolymorphicType)(this.internalModel, this.relationshipMeta, newRecord);

      if (this.inverseRecord) {
        this.removeRecord(this.inverseRecord);
      }

      this.inverseRecord = newRecord;
      _Relationship.prototype.addRecord.call(this, newRecord);
      this.notifyBelongsToChanged();
    };

    BelongsToRelationship.prototype.setRecordPromise = function setRecordPromise(newPromise) {
      var content = newPromise.get && newPromise.get('content');
      (0, _debug.assert)("You passed in a promise that did not originate from an EmberData relationship. You can only pass promises that come from a belongsTo or hasMany relationship to the get call.", content !== undefined);
      this.setRecord(content ? content._internalModel : content);
    };

    BelongsToRelationship.prototype.removeRecordFromOwn = function removeRecordFromOwn(record) {
      if (!this.members.has(record)) {
        return;
      }
      this.inverseRecord = null;
      _Relationship.prototype.removeRecordFromOwn.call(this, record);
      this.notifyBelongsToChanged();
    };

    BelongsToRelationship.prototype.notifyBelongsToChanged = function notifyBelongsToChanged() {
      this.internalModel.notifyBelongsToChanged(this.key);
    };

    BelongsToRelationship.prototype.removeCanonicalRecordFromOwn = function removeCanonicalRecordFromOwn(record) {
      if (!this.canonicalMembers.has(record)) {
        return;
      }
      this.canonicalState = null;
      _Relationship.prototype.removeCanonicalRecordFromOwn.call(this, record);
    };

    BelongsToRelationship.prototype.findRecord = function findRecord() {
      if (this.inverseRecord) {
        return this.store._findByInternalModel(this.inverseRecord);
      } else {
        return _ember.default.RSVP.Promise.resolve(null);
      }
    };

    BelongsToRelationship.prototype.fetchLink = function fetchLink() {
      var _this2 = this;

      return this.store.findBelongsTo(this.internalModel, this.link, this.relationshipMeta).then(function (record) {
        if (record) {
          _this2.addRecord(record);
        }
        return record;
      });
    };

    BelongsToRelationship.prototype.getRecord = function getRecord() {
      var _this3 = this;

      //TODO(Igor) flushCanonical here once our syncing is not stupid
      if (this.isAsync) {
        var promise = void 0;
        if (this.link) {
          if (this.hasLoaded) {
            promise = this.findRecord();
          } else {
            promise = this.findLink().then(function () {
              return _this3.findRecord();
            });
          }
        } else {
          promise = this.findRecord();
        }

        return _promiseProxies.PromiseObject.create({
          promise: promise,
          content: this.inverseRecord ? this.inverseRecord.getRecord() : null
        });
      } else {
        if (this.inverseRecord === null) {
          return null;
        }
        var toReturn = this.inverseRecord.getRecord();
        (0, _debug.assert)("You looked up the '" + this.key + "' relationship on a '" + this.internalModel.modelName + "' with id " + this.internalModel.id + " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.belongsTo({ async: true })`)", toReturn === null || !toReturn.get('isEmpty'));
        return toReturn;
      }
    };

    BelongsToRelationship.prototype.reload = function reload() {
      // TODO handle case when reload() is triggered multiple times

      if (this.link) {
        return this.fetchLink();
      }

      // reload record, if it is already loaded
      if (this.inverseRecord && this.inverseRecord.hasRecord) {
        return this.inverseRecord.record.reload();
      }

      return this.findRecord();
    };

    BelongsToRelationship.prototype.updateData = function updateData(data) {
      var internalModel = this.store._pushResourceIdentifier(this, data);
      this.setCanonicalRecord(internalModel);
    };

    return BelongsToRelationship;
  }(_relationship.default);

  exports.default = BelongsToRelationship;
});