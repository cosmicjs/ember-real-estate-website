define("ember-data/-private/system/snapshot", ["exports", "ember"], function (exports, _ember) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var get = _ember.default.get;

  var Snapshot = function () {
    function Snapshot(internalModel) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Snapshot);

      this._attributes = Object.create(null);
      this._belongsToRelationships = Object.create(null);
      this._belongsToIds = Object.create(null);
      this._hasManyRelationships = Object.create(null);
      this._hasManyIds = Object.create(null);
      this._internalModel = internalModel;

      var record = internalModel.getRecord();

      /**
       The underlying record for this snapshot. Can be used to access methods and
       properties defined on the record.
        Example
        ```javascript
       let json = snapshot.record.toJSON();
       ```
        @property record
       @type {DS.Model}
       */
      this.record = record;
      record.eachAttribute(function (keyName) {
        return _this._attributes[keyName] = get(record, keyName);
      });

      /**
       The id of the snapshot's underlying record
        Example
        ```javascript
       // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
       postSnapshot.id; // => '1'
       ```
        @property id
       @type {String}
       */
      this.id = internalModel.id;

      /**
       A hash of adapter options
       @property adapterOptions
       @type {Object}
       */
      this.adapterOptions = options.adapterOptions;
      this.include = options.include;

      /**
       The type of the underlying record for this snapshot, as a DS.Model.
        @property type
       @type {DS.Model}
       */
      // TODO @runspired we should deprecate this in favor of modelClass but only once
      // we've cleaned up the internals enough that a public change to follow suite is
      // uncontroversial.
      this.type = internalModel.modelClass;

      /**
       The name of the type of the underlying record for this snapshot, as a string.
        @property modelName
       @type {String}
       */
      this.modelName = internalModel.modelName;

      this._changedAttributes = record.changedAttributes();
    }

    /**
     Returns the value of an attribute.
      Example
      ```javascript
     // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
     postSnapshot.attr('author'); // => 'Tomster'
     postSnapshot.attr('title'); // => 'Ember.js rocks'
     ```
      Note: Values are loaded eagerly and cached when the snapshot is created.
      @method attr
     @param {String} keyName
     @return {Object} The attribute value or undefined
     */


    Snapshot.prototype.attr = function attr(keyName) {
      if (keyName in this._attributes) {
        return this._attributes[keyName];
      }
      throw new _ember.default.Error("Model '" + _ember.default.inspect(this.record) + "' has no attribute named '" + keyName + "' defined.");
    };

    Snapshot.prototype.attributes = function attributes() {
      return _ember.default.copy(this._attributes);
    };

    Snapshot.prototype.changedAttributes = function changedAttributes() {
      var changedAttributes = Object.create(null);
      var changedAttributeKeys = Object.keys(this._changedAttributes);

      for (var i = 0, length = changedAttributeKeys.length; i < length; i++) {
        var key = changedAttributeKeys[i];
        changedAttributes[key] = _ember.default.copy(this._changedAttributes[key]);
      }

      return changedAttributes;
    };

    Snapshot.prototype.belongsTo = function belongsTo(keyName, options) {
      var id = options && options.id;
      var relationship = void 0,
          inverseRecord = void 0,
          hasData = void 0;
      var result = void 0;

      if (id && keyName in this._belongsToIds) {
        return this._belongsToIds[keyName];
      }

      if (!id && keyName in this._belongsToRelationships) {
        return this._belongsToRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'belongsTo')) {
        throw new _ember.default.Error("Model '" + _ember.default.inspect(this.record) + "' has no belongsTo relationship named '" + keyName + "' defined.");
      }

      hasData = get(relationship, 'hasData');
      inverseRecord = get(relationship, 'inverseRecord');

      if (hasData) {
        if (inverseRecord && !inverseRecord.isDeleted()) {
          if (id) {
            result = get(inverseRecord, 'id');
          } else {
            result = inverseRecord.createSnapshot();
          }
        } else {
          result = null;
        }
      }

      if (id) {
        this._belongsToIds[keyName] = result;
      } else {
        this._belongsToRelationships[keyName] = result;
      }

      return result;
    };

    Snapshot.prototype.hasMany = function hasMany(keyName, options) {
      var ids = options && options.ids;
      var relationship = void 0,
          members = void 0,
          hasData = void 0;
      var results = void 0;

      if (ids && keyName in this._hasManyIds) {
        return this._hasManyIds[keyName];
      }

      if (!ids && keyName in this._hasManyRelationships) {
        return this._hasManyRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'hasMany')) {
        throw new _ember.default.Error("Model '" + _ember.default.inspect(this.record) + "' has no hasMany relationship named '" + keyName + "' defined.");
      }

      hasData = get(relationship, 'hasData');
      members = get(relationship, 'members');

      if (hasData) {
        results = [];
        members.forEach(function (member) {
          if (!member.isDeleted()) {
            if (ids) {
              results.push(member.id);
            } else {
              results.push(member.createSnapshot());
            }
          }
        });
      }

      if (ids) {
        this._hasManyIds[keyName] = results;
      } else {
        this._hasManyRelationships[keyName] = results;
      }

      return results;
    };

    Snapshot.prototype.eachAttribute = function eachAttribute(callback, binding) {
      this.record.eachAttribute(callback, binding);
    };

    Snapshot.prototype.eachRelationship = function eachRelationship(callback, binding) {
      this.record.eachRelationship(callback, binding);
    };

    Snapshot.prototype.serialize = function serialize(options) {
      return this.record.store.serializerFor(this.modelName).serialize(this, options);
    };

    return Snapshot;
  }();

  exports.default = Snapshot;
});