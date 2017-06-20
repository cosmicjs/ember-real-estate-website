define('ember-data/-private/system/relationships/state/relationship', ['exports', 'ember-data/-private/debug', 'ember-data/-private/system/ordered-set', 'ember-data/-private/system/normalize-link'], function (exports, _debug, _orderedSet, _normalizeLink2) {
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

  var Relationship = function () {
    function Relationship(store, internalModel, inverseKey, relationshipMeta) {
      _classCallCheck(this, Relationship);

      var async = relationshipMeta.options.async;
      this.members = new _orderedSet.default();
      this.canonicalMembers = new _orderedSet.default();
      this.store = store;
      this.key = relationshipMeta.key;
      this.inverseKey = inverseKey;
      this.internalModel = internalModel;
      this.isAsync = typeof async === 'undefined' ? true : async;
      this.relationshipMeta = relationshipMeta;
      //This probably breaks for polymorphic relationship in complex scenarios, due to
      //multiple possible modelNames
      this.inverseKeyForImplicit = this.internalModel.modelName + this.key;
      this.linkPromise = null;
      this.meta = null;
      this.hasData = false;
      this.hasLoaded = false;
    }

    // TODO @runspired deprecate this as it was never truly a record instance


    Relationship.prototype.destroy = function destroy() {
      var _this = this;

      if (!this.inverseKey) {
        return;
      }

      var allMembers =
      // we actually want a union of members and canonicalMembers
      // they should be disjoint but currently are not due to a bug
      this.members.toArray().concat(this.canonicalMembers.toArray());

      allMembers.forEach(function (inverseInternalModel) {
        var relationship = inverseInternalModel._relationships.get(_this.inverseKey);
        // TODO: there is always a relationship in this case; this guard exists
        // because there are tests that fail in teardown after putting things in
        // invalid state
        if (relationship) {
          relationship.inverseDidDematerialize();
        }
      });
    };

    Relationship.prototype.inverseDidDematerialize = function inverseDidDematerialize() {};

    Relationship.prototype.updateMeta = function updateMeta(meta) {
      this.meta = meta;
    };

    Relationship.prototype.clear = function clear() {

      var members = this.members.list;
      while (members.length > 0) {
        var member = members[0];
        this.removeRecord(member);
      }

      var canonicalMembers = this.canonicalMembers.list;
      while (canonicalMembers.length > 0) {
        var _member = canonicalMembers[0];
        this.removeCanonicalRecord(_member);
      }
    };

    Relationship.prototype.removeRecords = function removeRecords(records) {
      var _this2 = this;

      records.forEach(function (record) {
        return _this2.removeRecord(record);
      });
    };

    Relationship.prototype.addRecords = function addRecords(records, idx) {
      var _this3 = this;

      records.forEach(function (record) {
        _this3.addRecord(record, idx);
        if (idx !== undefined) {
          idx++;
        }
      });
    };

    Relationship.prototype.addCanonicalRecords = function addCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.addCanonicalRecord(records[i], i + idx);
        } else {
          this.addCanonicalRecord(records[i]);
        }
      }
    };

    Relationship.prototype.addCanonicalRecord = function addCanonicalRecord(record, idx) {
      if (!this.canonicalMembers.has(record)) {
        this.canonicalMembers.add(record);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addCanonicalRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addCanonicalRecord(this.record);
        }
      }
      this.flushCanonicalLater();
      this.setHasData(true);
    };

    Relationship.prototype.removeCanonicalRecords = function removeCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.removeCanonicalRecord(records[i], i + idx);
        } else {
          this.removeCanonicalRecord(records[i]);
        }
      }
    };

    Relationship.prototype.removeCanonicalRecord = function removeCanonicalRecord(record, idx) {
      if (this.canonicalMembers.has(record)) {
        this.removeCanonicalRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeCanonicalRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeCanonicalRecord(this.record);
          }
        }
      }
      this.flushCanonicalLater();
    };

    Relationship.prototype.addRecord = function addRecord(record, idx) {
      if (!this.members.has(record)) {
        this.members.addWithIndex(record, idx);
        this.notifyRecordRelationshipAdded(record, idx);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addRecord(this.record);
        }
        this.record.updateRecordArrays();
      }
      this.setHasData(true);
    };

    Relationship.prototype.removeRecord = function removeRecord(record) {
      if (this.members.has(record)) {
        this.removeRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeRecord(this.record);
          }
        }
      }
    };

    Relationship.prototype.removeRecordFromInverse = function removeRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeRecordFromOwn(this.record);
      }
    };

    Relationship.prototype.removeRecordFromOwn = function removeRecordFromOwn(record) {
      this.members.delete(record);
      this.notifyRecordRelationshipRemoved(record);
      this.record.updateRecordArrays();
    };

    Relationship.prototype.removeCanonicalRecordFromInverse = function removeCanonicalRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeCanonicalRecordFromOwn(this.record);
      }
    };

    Relationship.prototype.removeCanonicalRecordFromOwn = function removeCanonicalRecordFromOwn(record) {
      this.canonicalMembers.delete(record);
      this.flushCanonicalLater();
    };

    Relationship.prototype.flushCanonical = function flushCanonical() {
      var list = this.members.list;
      this.willSync = false;
      //a hack for not removing new records
      //TODO remove once we have proper diffing
      var newRecords = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].isNew()) {
          newRecords.push(list[i]);
        }
      }

      //TODO(Igor) make this less abysmally slow
      this.members = this.canonicalMembers.copy();
      for (var _i = 0; _i < newRecords.length; _i++) {
        this.members.add(newRecords[_i]);
      }
    };

    Relationship.prototype.flushCanonicalLater = function flushCanonicalLater() {
      if (this.willSync) {
        return;
      }
      this.willSync = true;
      this.store._updateRelationshipState(this);
    };

    Relationship.prototype.updateLink = function updateLink(link) {
      (0, _debug.warn)('You pushed a record of type \'' + this.record.modelName + '\' with a relationship \'' + this.key + '\' configured as \'async: false\'. You\'ve included a link but no primary data, this may be an error in your payload.', this.isAsync || this.hasData, {
        id: 'ds.store.push-link-for-sync-relationship'
      });
      (0, _debug.assert)('You have pushed a record of type \'' + this.record.modelName + '\' with \'' + this.key + '\' as a link, but the value of that link is not a string.', typeof link === 'string' || link === null);

      this.link = link;
      this.linkPromise = null;
      this.record.notifyPropertyChange(this.key);
    };

    Relationship.prototype.findLink = function findLink() {
      if (this.linkPromise) {
        return this.linkPromise;
      } else {
        var promise = this.fetchLink();
        this.linkPromise = promise;
        return promise.then(function (result) {
          return result;
        });
      }
    };

    Relationship.prototype.updateRecordsFromAdapter = function updateRecordsFromAdapter(records) {
      //TODO(Igor) move this to a proper place
      //TODO Once we have adapter support, we need to handle updated and canonical changes
      this.computeChanges(records);
    };

    Relationship.prototype.notifyRecordRelationshipAdded = function notifyRecordRelationshipAdded() {};

    Relationship.prototype.notifyRecordRelationshipRemoved = function notifyRecordRelationshipRemoved() {};

    Relationship.prototype.setHasData = function setHasData(value) {
      this.hasData = value;
    };

    Relationship.prototype.setHasLoaded = function setHasLoaded(value) {
      this.hasLoaded = value;
    };

    Relationship.prototype.push = function push(payload) {

      var hasData = false;
      var hasLink = false;

      if (payload.meta) {
        this.updateMeta(payload.meta);
      }

      if (payload.data !== undefined) {
        hasData = true;
        this.updateData(payload.data);
      }

      if (payload.links && payload.links.related) {
        var relatedLink = (0, _normalizeLink2.default)(payload.links.related);
        if (relatedLink && relatedLink.href && relatedLink.href !== this.link) {
          hasLink = true;
          this.updateLink(relatedLink.href);
        }
      }

      /*
       Data being pushed into the relationship might contain only data or links,
       or a combination of both.
        If we got data we want to set both hasData and hasLoaded to true since
       this would indicate that we should prefer the local state instead of
       trying to fetch the link or call findRecord().
        If we have no data but a link is present we want to set hasLoaded to false
       without modifying the hasData flag. This will ensure we fetch the updated
       link next time the relationship is accessed.
       */
      if (hasData) {
        this.setHasData(true);
        this.setHasLoaded(true);
      } else if (hasLink) {
        this.setHasLoaded(false);
      }
    };

    Relationship.prototype.updateData = function updateData() {};

    _createClass(Relationship, [{
      key: 'record',
      get: function get() {
        return this.internalModel;
      }
    }, {
      key: 'parentType',
      get: function get() {
        return this.internalModel.modelName;
      }
    }]);

    return Relationship;
  }();

  exports.default = Relationship;
});