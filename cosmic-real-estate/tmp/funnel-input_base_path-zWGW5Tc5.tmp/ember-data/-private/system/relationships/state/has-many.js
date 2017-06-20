define('ember-data/-private/system/relationships/state/has-many', ['exports', 'ember-data/-private/debug', 'ember-data/-private/system/promise-proxies', 'ember-data/-private/system/relationships/state/relationship', 'ember-data/-private/system/ordered-set', 'ember-data/-private/system/many-array'], function (exports, _debug, _promiseProxies, _relationship, _orderedSet, _manyArray) {
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

  var ManyRelationship = function (_Relationship) {
    _inherits(ManyRelationship, _Relationship);

    function ManyRelationship(store, record, inverseKey, relationshipMeta) {
      _classCallCheck(this, ManyRelationship);

      var _this = _possibleConstructorReturn(this, _Relationship.call(this, store, record, inverseKey, relationshipMeta));

      _this.belongsToType = relationshipMeta.type;
      _this.canonicalState = [];
      _this.isPolymorphic = relationshipMeta.options.polymorphic;
      _this._manyArray = null;
      _this.__loadingPromise = null;
      return _this;
    }

    ManyRelationship.prototype._updateLoadingPromise = function _updateLoadingPromise(promise, content) {
      if (this.__loadingPromise) {
        if (content) {
          this.__loadingPromise.set('content', content);
        }
        this.__loadingPromise.set('promise', promise);
      } else {
        this.__loadingPromise = new _promiseProxies.PromiseManyArray({
          promise: promise,
          content: content
        });
      }

      return this.__loadingPromise;
    };

    ManyRelationship.prototype.destroy = function destroy() {
      _Relationship.prototype.destroy.call(this);
      if (this._manyArray) {
        this._manyArray.destroy();
        this._manyArray = null;
      }

      if (this._loadingPromise) {
        this._loadingPromise.destroy();
      }
    };

    ManyRelationship.prototype.updateMeta = function updateMeta(meta) {
      _Relationship.prototype.updateMeta.call(this, meta);
      if (this._manyArray) {
        this._manyArray.set('meta', meta);
      }
    };

    ManyRelationship.prototype.addCanonicalRecord = function addCanonicalRecord(record, idx) {
      if (this.canonicalMembers.has(record)) {
        return;
      }
      if (idx !== undefined) {
        this.canonicalState.splice(idx, 0, record);
      } else {
        this.canonicalState.push(record);
      }
      _Relationship.prototype.addCanonicalRecord.call(this, record, idx);
    };

    ManyRelationship.prototype.inverseDidDematerialize = function inverseDidDematerialize() {
      if (this._manyArray) {
        this._manyArray.destroy();
        this._manyArray = null;
      }
      this.notifyHasManyChanged();
    };

    ManyRelationship.prototype.addRecord = function addRecord(record, idx) {
      if (this.members.has(record)) {
        return;
      }
      _Relationship.prototype.addRecord.call(this, record, idx);
      // make lazy later
      this.manyArray.internalAddRecords([record], idx);
    };

    ManyRelationship.prototype.removeCanonicalRecordFromOwn = function removeCanonicalRecordFromOwn(record, idx) {
      var i = idx;
      if (!this.canonicalMembers.has(record)) {
        return;
      }
      if (i === undefined) {
        i = this.canonicalState.indexOf(record);
      }
      if (i > -1) {
        this.canonicalState.splice(i, 1);
      }
      _Relationship.prototype.removeCanonicalRecordFromOwn.call(this, record, idx);
    };

    ManyRelationship.prototype.flushCanonical = function flushCanonical() {
      if (this._manyArray) {
        this._manyArray.flushCanonical();
      }
      _Relationship.prototype.flushCanonical.call(this);
    };

    ManyRelationship.prototype.removeRecordFromOwn = function removeRecordFromOwn(record, idx) {
      if (!this.members.has(record)) {
        return;
      }
      _Relationship.prototype.removeRecordFromOwn.call(this, record, idx);
      var manyArray = this.manyArray;
      if (idx !== undefined) {
        //TODO(Igor) not used currently, fix
        manyArray.currentState.removeAt(idx);
      } else {
        manyArray.internalRemoveRecords([record]);
      }
    };

    ManyRelationship.prototype.notifyRecordRelationshipAdded = function notifyRecordRelationshipAdded(record, idx) {
      (0, _debug.assertPolymorphicType)(this.record, this.relationshipMeta, record);

      this.record.notifyHasManyAdded(this.key, record, idx);
    };

    ManyRelationship.prototype.reload = function reload() {
      var manyArray = this.manyArray;
      var manyArrayLoadedState = manyArray.get('isLoaded');

      if (this._loadingPromise) {
        if (this._loadingPromise.get('isPending')) {
          return this._loadingPromise;
        }
        if (this._loadingPromise.get('isRejected')) {
          manyArray.set('isLoaded', manyArrayLoadedState);
        }
      }

      var promise = void 0;
      if (this.link) {
        promise = this.fetchLink();
      } else {
        promise = this.store._scheduleFetchMany(manyArray.currentState).then(function () {
          return manyArray;
        });
      }

      this._updateLoadingPromise(promise);
      return this._loadingPromise;
    };

    ManyRelationship.prototype.computeChanges = function computeChanges(records) {
      var members = this.canonicalMembers;
      var recordsToRemove = [];
      var recordSet = setForArray(records);

      members.forEach(function (member) {
        if (recordSet.has(member)) {
          return;
        }

        recordsToRemove.push(member);
      });

      this.removeCanonicalRecords(recordsToRemove);

      for (var i = 0, l = records.length; i < l; i++) {
        var record = records[i];
        this.removeCanonicalRecord(record);
        this.addCanonicalRecord(record, i);
      }
    };

    ManyRelationship.prototype.fetchLink = function fetchLink() {
      var _this2 = this;

      return this.store.findHasMany(this.record, this.link, this.relationshipMeta).then(function (records) {
        if (records.hasOwnProperty('meta')) {
          _this2.updateMeta(records.meta);
        }
        _this2.store._backburner.join(function () {
          _this2.updateRecordsFromAdapter(records);
          _this2.manyArray.set('isLoaded', true);
        });
        return _this2.manyArray;
      });
    };

    ManyRelationship.prototype.findRecords = function findRecords() {
      var manyArray = this.manyArray;
      var internalModels = manyArray.currentState;

      //TODO CLEANUP
      return this.store.findMany(internalModels).then(function () {
        if (!manyArray.get('isDestroyed')) {
          //Goes away after the manyArray refactor
          manyArray.set('isLoaded', true);
        }
        return manyArray;
      });
    };

    ManyRelationship.prototype.notifyHasManyChanged = function notifyHasManyChanged() {
      this.record.notifyHasManyAdded(this.key);
    };

    ManyRelationship.prototype.getRecords = function getRecords() {
      var _this3 = this;

      //TODO(Igor) sync server here, once our syncing is not stupid
      var manyArray = this.manyArray;
      if (this.isAsync) {
        var promise = void 0;
        if (this.link) {
          if (this.hasLoaded) {
            promise = this.findRecords();
          } else {
            promise = this.findLink().then(function () {
              return _this3.findRecords();
            });
          }
        } else {
          promise = this.findRecords();
        }
        return this._updateLoadingPromise(promise, manyArray);
      } else {
        (0, _debug.assert)('You looked up the \'' + this.key + '\' relationship on a \'' + this.record.type.modelName + '\' with id ' + this.record.id + ' but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (\'DS.hasMany({ async: true })\')', manyArray.isEvery('isEmpty', false));

        //TODO(Igor) WTF DO I DO HERE?
        // TODO @runspired equal WTFs to Igor
        if (!manyArray.get('isDestroyed')) {
          manyArray.set('isLoaded', true);
        }
        return manyArray;
      }
    };

    ManyRelationship.prototype.updateData = function updateData(data) {
      var internalModels = this.store._pushResourceIdentifiers(this, data);
      this.updateRecordsFromAdapter(internalModels);
    };

    _createClass(ManyRelationship, [{
      key: '_loadingPromise',
      get: function get() {
        return this.__loadingPromise;
      }
    }, {
      key: 'manyArray',
      get: function get() {
        if (!this._manyArray) {
          this._manyArray = _manyArray.default.create({
            canonicalState: this.canonicalState,
            store: this.store,
            relationship: this,
            type: this.store.modelFor(this.belongsToType),
            record: this.record,
            meta: this.meta,
            isPolymorphic: this.isPolymorphic
          });
        }
        return this._manyArray;
      }
    }]);

    return ManyRelationship;
  }(_relationship.default);

  exports.default = ManyRelationship;


  function setForArray(array) {
    var set = new _orderedSet.default();

    if (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        set.add(array[i]);
      }
    }

    return set;
  }
});