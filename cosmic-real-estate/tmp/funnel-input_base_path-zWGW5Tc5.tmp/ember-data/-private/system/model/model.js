define("ember-data/-private/system/model/model", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/model/errors", "ember-data/-private/features", "ember-data/-private/system/model/states", "ember-data/-private/system/relationships/ext"], function (exports, _ember, _debug, _promiseProxies, _errors, _features, _states, _ext) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = _ember.default.get,
      computed = _ember.default.computed,
      Map = _ember.default.Map;


  /**
    @module ember-data
  */

  function findPossibleInverses(type, inverseType, name, relationshipsSoFar) {
    var possibleRelationships = relationshipsSoFar || [];

    var relationshipMap = get(inverseType, 'relationships');
    if (!relationshipMap) {
      return possibleRelationships;
    }

    var relationships = relationshipMap.get(type.modelName).filter(function (relationship) {
      var optionsForRelationship = inverseType.metaForProperty(relationship.name).options;

      if (!optionsForRelationship.inverse) {
        return true;
      }

      return name === optionsForRelationship.inverse;
    });

    if (relationships) {
      possibleRelationships.push.apply(possibleRelationships, relationships);
    }

    //Recurse to support polymorphism
    if (type.superclass) {
      findPossibleInverses(type.superclass, inverseType, name, possibleRelationships);
    }

    return possibleRelationships;
  }

  function intersection(array1, array2) {
    var result = [];
    array1.forEach(function (element) {
      if (array2.indexOf(element) >= 0) {
        result.push(element);
      }
    });

    return result;
  }

  var RESERVED_MODEL_PROPS = ['currentState', 'data', 'store'];

  var retrieveFromCurrentState = computed('currentState', function (key) {
    return get(this._internalModel.currentState, key);
  }).readOnly();

  /**
  
    The model class that all Ember Data records descend from.
    This is the public API of Ember Data models. If you are using Ember Data
    in your application, this is the class you should use.
    If you are working on Ember Data internals, you most likely want to be dealing
    with `InternalModel`
  
    @class Model
    @namespace DS
    @extends Ember.Object
    @uses Ember.Evented
  */
  var Model = _ember.default.Object.extend(_ember.default.Evented, {
    _internalModel: null,
    store: null,
    __defineNonEnumerable: function __defineNonEnumerable(property) {
      this[property.name] = property.descriptor.value;
    },


    /**
      If this property is `true` the record is in the `empty`
      state. Empty is the first state all records enter after they have
      been created. Most records created by the store will quickly
      transition to the `loading` state if data needs to be fetched from
      the server or the `created` state if the record is created on the
      client. A record can also enter the empty state if the adapter is
      unable to locate the record.
       @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loading` state. A
      record enters this state when the store asks the adapter for its
      data. It remains in this state until the adapter provides the
      requested data.
       @property isLoading
      @type {Boolean}
      @readOnly
    */
    isLoading: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loaded` state. A
      record enters this state when its data is populated. Most of a
      record's lifecycle is spent inside substates of the `loaded`
      state.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isLoaded'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('isLoaded'); // true
      });
      ```
       @property isLoaded
      @type {Boolean}
      @readOnly
    */
    isLoaded: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `dirty` state. The
      record has local changes that have not yet been saved by the
      adapter. This includes records that have been created (but not yet
      saved) or deleted.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('hasDirtyAttributes'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('hasDirtyAttributes'); // false
        model.set('foo', 'some value');
        model.get('hasDirtyAttributes'); // true
      });
      ```
       @since 1.13.0
      @property hasDirtyAttributes
      @type {Boolean}
      @readOnly
    */
    hasDirtyAttributes: computed('currentState.isDirty', function () {
      return this.get('currentState.isDirty');
    }),
    /**
      If this property is `true` the record is in the `saving` state. A
      record enters the saving state when `save` is called, but the
      adapter has not yet acknowledged that the changes have been
      persisted to the backend.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isSaving'); // false
      let promise = record.save();
      record.get('isSaving'); // true
      promise.then(function() {
        record.get('isSaving'); // false
      });
      ```
       @property isSaving
      @type {Boolean}
      @readOnly
    */
    isSaving: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `deleted` state
      and has been marked for deletion. When `isDeleted` is true and
      `hasDirtyAttributes` is true, the record is deleted locally but the deletion
      was not yet persisted. When `isSaving` is true, the change is
      in-flight. When both `hasDirtyAttributes` and `isSaving` are false, the
      change has persisted.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isDeleted');    // false
      record.deleteRecord();
       // Locally deleted
      record.get('isDeleted');           // true
      record.get('hasDirtyAttributes');  // true
      record.get('isSaving');            // false
       // Persisting the deletion
      let promise = record.save();
      record.get('isDeleted');    // true
      record.get('isSaving');     // true
       // Deletion Persisted
      promise.then(function() {
        record.get('isDeleted');          // true
        record.get('isSaving');           // false
        record.get('hasDirtyAttributes'); // false
      });
      ```
       @property isDeleted
      @type {Boolean}
      @readOnly
    */
    isDeleted: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `new` state. A
      record will be in the `new` state when it has been created on the
      client and the adapter has not yet report that it was successfully
      saved.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isNew'); // true
       record.save().then(function(model) {
        model.get('isNew'); // false
      });
      ```
       @property isNew
      @type {Boolean}
      @readOnly
    */
    isNew: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `valid` state.
       A record will be in the `valid` state when the adapter did not report any
      server-side validation failures.
       @property isValid
      @type {Boolean}
      @readOnly
    */
    isValid: retrieveFromCurrentState,
    /**
      If the record is in the dirty state this property will report what
      kind of change has caused it to move into the dirty
      state. Possible values are:
       - `created` The record has been created by the client and not yet saved to the adapter.
      - `updated` The record has been updated by the client and not yet saved to the adapter.
      - `deleted` The record has been deleted by the client and not yet saved to the adapter.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('dirtyType'); // 'created'
      ```
       @property dirtyType
      @type {String}
      @readOnly
    */
    dirtyType: retrieveFromCurrentState,

    /**
      If `true` the adapter reported that it was unable to save local
      changes to the backend for any reason other than a server-side
      validation error.
       Example
       ```javascript
      record.get('isError'); // false
      record.set('foo', 'valid value');
      record.save().then(null, function() {
        record.get('isError'); // true
      });
      ```
       @property isError
      @type {Boolean}
      @readOnly
    */
    isError: false,

    /**
      If `true` the store is attempting to reload the record from the adapter.
       Example
       ```javascript
      record.get('isReloading'); // false
      record.reload();
      record.get('isReloading'); // true
      ```
       @property isReloading
      @type {Boolean}
      @readOnly
    */
    isReloading: false,

    /**
      All ember models have an id property. This is an identifier
      managed by an external source. These are always coerced to be
      strings before being used internally. Note when declaring the
      attributes for a model it is an error to declare an id
      attribute.
       ```javascript
      let record = store.createRecord('model');
      record.get('id'); // null
       store.findRecord('model', 1).then(function(model) {
        model.get('id'); // '1'
      });
      ```
       @property id
      @type {String}
    */
    id: null,

    /**
      @property currentState
      @private
      @type {Object}
    */
    currentState: _states.default.empty,

    /**
      When the record is in the `invalid` state this object will contain
      any errors returned by the adapter. When present the errors hash
      contains keys corresponding to the invalid property names
      and values which are arrays of Javascript objects with two keys:
       - `message` A string containing the error message from the backend
      - `attribute` The name of the property associated with this error message
       ```javascript
      record.get('errors.length'); // 0
      record.set('foo', 'invalid value');
      record.save().catch(function() {
        record.get('errors').get('foo');
        // [{message: 'foo should be a number.', attribute: 'foo'}]
      });
      ```
       The `errors` property us useful for displaying error messages to
      the user.
       ```handlebars
      <label>Username: {{input value=username}} </label>
      {{#each model.errors.username as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      <label>Email: {{input value=email}} </label>
      {{#each model.errors.email as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      ```
        You can also access the special `messages` property on the error
      object to get an array of all the error strings.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property errors
      @type {DS.Errors}
    */
    errors: computed(function () {
      var errors = _errors.default.create();

      errors._registerHandlers(this._internalModel, function () {
        this.send('becameInvalid');
      }, function () {
        this.send('becameValid');
      });
      return errors;
    }).readOnly(),

    /**
      This property holds the `DS.AdapterError` object with which
      last adapter operation was rejected.
       @property adapterError
      @type {DS.AdapterError}
    */
    adapterError: null,

    serialize: function serialize(options) {
      return this._internalModel.createSnapshot().serialize(options);
    },
    toJSON: function toJSON(options) {
      // container is for lazy transform lookups
      var serializer = this.store.serializerFor('-default');
      var snapshot = this._internalModel.createSnapshot();

      return serializer.serialize(snapshot, options);
    },
    ready: function ready() {},
    didLoad: function didLoad() {},
    didUpdate: function didUpdate() {},
    didCreate: function didCreate() {},
    didDelete: function didDelete() {},
    becameInvalid: function becameInvalid() {},
    becameError: function becameError() {},
    rolledBack: function rolledBack() {},
    send: function send(name, context) {
      return this._internalModel.send(name, context);
    },
    transitionTo: function transitionTo(name) {
      return this._internalModel.transitionTo(name);
    },
    deleteRecord: function deleteRecord() {
      this._internalModel.deleteRecord();
    },
    destroyRecord: function destroyRecord(options) {
      this.deleteRecord();
      return this.save(options);
    },
    unloadRecord: function unloadRecord() {
      if (this.isDestroyed) {
        return;
      }
      this._internalModel.unloadRecord();
    },
    _notifyProperties: function _notifyProperties(keys) {
      _ember.default.beginPropertyChanges();
      var key = void 0;
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        this.notifyPropertyChange(key);
      }
      _ember.default.endPropertyChanges();
    },
    changedAttributes: function changedAttributes() {
      return this._internalModel.changedAttributes();
    },
    rollbackAttributes: function rollbackAttributes() {
      this._internalModel.rollbackAttributes();
    },
    _createSnapshot: function _createSnapshot() {
      return this._internalModel.createSnapshot();
    },
    toStringExtension: function toStringExtension() {
      return get(this, 'id');
    },
    save: function save(options) {
      var _this = this;

      return _promiseProxies.PromiseObject.create({
        promise: this._internalModel.save(options).then(function () {
          return _this;
        })
      });
    },
    reload: function reload() {
      var _this2 = this;

      return _promiseProxies.PromiseObject.create({
        promise: this._internalModel.reload().then(function () {
          return _this2;
        })
      });
    },
    trigger: function trigger(name) {
      var length = arguments.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = arguments[i];
      }

      _ember.default.tryInvoke(this, name, args);
      this._super.apply(this, arguments);
    },
    willMergeMixin: function willMergeMixin(props) {
      var constructor = this.constructor;
      (0, _debug.assert)('`' + intersection(Object.keys(props), RESERVED_MODEL_PROPS)[0] + '` is a reserved property name on DS.Model objects. Please choose a different property name for ' + constructor.toString(), !intersection(Object.keys(props), RESERVED_MODEL_PROPS)[0]);
      (0, _debug.assert)("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + constructor.toString(), Object.keys(props).indexOf('id') === -1);
    },
    attr: function attr() {
      (0, _debug.assert)("The `attr` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
    },
    belongsTo: function belongsTo(name) {
      return this._internalModel.referenceFor('belongsTo', name);
    },
    hasMany: function hasMany(name) {
      return this._internalModel.referenceFor('hasMany', name);
    },


    setId: _ember.default.observer('id', function () {
      this._internalModel.setId(this.get('id'));
    }),

    _debugInfo: function _debugInfo() {
      var attributes = ['id'];
      var relationships = {};
      var expensiveProperties = [];

      this.eachAttribute(function (name, meta) {
        return attributes.push(name);
      });

      var groups = [{
        name: 'Attributes',
        properties: attributes,
        expand: true
      }];

      this.eachRelationship(function (name, relationship) {
        var properties = relationships[relationship.kind];

        if (properties === undefined) {
          properties = relationships[relationship.kind] = [];
          groups.push({
            name: relationship.name,
            properties: properties,
            expand: true
          });
        }
        properties.push(name);
        expensiveProperties.push(name);
      });

      groups.push({
        name: 'Flags',
        properties: ['isLoaded', 'hasDirtyAttributes', 'isSaving', 'isDeleted', 'isError', 'isNew', 'isValid']
      });

      return {
        propertyInfo: {
          // include all other mixins / properties (not just the grouped ones)
          includeOtherProperties: true,
          groups: groups,
          // don't pre-calculate unless cached
          expensiveProperties: expensiveProperties
        }
      };
    },
    notifyBelongsToChanged: function notifyBelongsToChanged(key) {
      this.notifyPropertyChange(key);
    },
    didDefineProperty: function didDefineProperty(proto, key, value) {
      // Check if the value being set is a computed property.
      if (value instanceof _ember.default.ComputedProperty) {

        // If it is, get the metadata for the relationship. This is
        // populated by the `DS.belongsTo` helper when it is creating
        // the computed property.
        var meta = value.meta();

        meta.parentType = proto.constructor;
      }
    },
    eachRelationship: function eachRelationship(callback, binding) {
      this.constructor.eachRelationship(callback, binding);
    },
    relationshipFor: function relationshipFor(name) {
      return get(this.constructor, 'relationshipsByName').get(name);
    },
    inverseFor: function inverseFor(key) {
      return this.constructor.inverseFor(key, this.store);
    },
    notifyHasManyAdded: function notifyHasManyAdded(key) {
      //We need to notifyPropertyChange in the adding case because we need to make sure
      //we fetch the newly added record in case it is unloaded
      //TODO(Igor): Consider whether we could do this only if the record state is unloaded

      //Goes away once hasMany is double promisified
      this.notifyPropertyChange(key);
    },
    eachAttribute: function eachAttribute(callback, binding) {
      this.constructor.eachAttribute(callback, binding);
    }
  });

  /**
   @property data
   @private
   @type {Object}
   */
  Object.defineProperty(Model.prototype, 'data', {
    get: function get() {
      return this._internalModel._data;
    }
  });

  (0, _debug.runInDebug)(function () {
    Model.reopen({
      init: function init() {
        this._super.apply(this, arguments);

        if (!this._internalModel) {
          throw new _ember.default.Error('You should not call `create` on a model. Instead, call `store.createRecord` with the attributes you would like to set.');
        }
      }
    });
  });

  Model.reopenClass({
    isModel: true,

    /**
      Override the class' `create()` method to raise an error. This
      prevents end users from inadvertently calling `create()` instead
      of `createRecord()`. The store is still able to create instances
      by calling the `_create()` method. To create an instance of a
      `DS.Model` use [store.createRecord](DS.Store.html#method_createRecord).
       @method create
      @private
      @static
    */
    /**
     Represents the model's class name as a string. This can be used to look up the model's class name through
     `DS.Store`'s modelFor method.
      `modelName` is generated for you by Ember Data. It will be a lowercased, dasherized string.
     For example:
      ```javascript
     store.modelFor('post').modelName; // 'post'
     store.modelFor('blog-post').modelName; // 'blog-post'
     ```
      The most common place you'll want to access `modelName` is in your serializer's `payloadKeyFromModelName` method. For example, to change payload
     keys to underscore (instead of dasherized), you might use the following code:
      ```javascript
     export default const PostSerializer = DS.RESTSerializer.extend({
       payloadKeyFromModelName: function(modelName) {
         return Ember.String.underscore(modelName);
       }
     });
     ```
     @property modelName
     @type String
     @readonly
     @static
    */
    modelName: null,

    typeForRelationship: function typeForRelationship(name, store) {
      var relationship = get(this, 'relationshipsByName').get(name);
      return relationship && store.modelFor(relationship.type);
    },


    inverseMap: _ember.default.computed(function () {
      return Object.create(null);
    }),

    inverseFor: function inverseFor(name, store) {
      var inverseMap = get(this, 'inverseMap');
      if (inverseMap[name]) {
        return inverseMap[name];
      } else {
        var inverse = this._findInverseFor(name, store);
        inverseMap[name] = inverse;
        return inverse;
      }
    },
    _findInverseFor: function _findInverseFor(name, store) {

      var inverseType = this.typeForRelationship(name, store);
      if (!inverseType) {
        return null;
      }

      var propertyMeta = this.metaForProperty(name);
      //If inverse is manually specified to be null, like  `comments: DS.hasMany('message', { inverse: null })`
      var options = propertyMeta.options;
      if (options.inverse === null) {
        return null;
      }

      var inverseName = void 0,
          inverseKind = void 0,
          inverse = void 0;

      //If inverse is specified manually, return the inverse
      if (options.inverse) {
        inverseName = options.inverse;
        inverse = _ember.default.get(inverseType, 'relationshipsByName').get(inverseName);

        (0, _debug.assert)("We found no inverse relationships by the name of '" + inverseName + "' on the '" + inverseType.modelName + "' model. This is most likely due to a missing attribute on your model definition.", !_ember.default.isNone(inverse));

        inverseKind = inverse.kind;
      } else {
        //No inverse was specified manually, we need to use a heuristic to guess one
        if (propertyMeta.type === propertyMeta.parentType.modelName) {
          (0, _debug.warn)("Detected a reflexive relationship by the name of '" + name + "' without an inverse option. Look at http://emberjs.com/guides/models/defining-models/#toc_reflexive-relation for how to explicitly specify inverses.", false, {
            id: 'ds.model.reflexive-relationship-without-inverse'
          });
        }

        var possibleRelationships = findPossibleInverses(this, inverseType, name);

        if (possibleRelationships.length === 0) {
          return null;
        }

        var filteredRelationships = possibleRelationships.filter(function (possibleRelationship) {
          var optionsForRelationship = inverseType.metaForProperty(possibleRelationship.name).options;
          return name === optionsForRelationship.inverse;
        });

        (0, _debug.assert)("You defined the '" + name + "' relationship on " + this + ", but you defined the inverse relationships of type " + inverseType.toString() + " multiple times. Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses", filteredRelationships.length < 2);

        if (filteredRelationships.length === 1) {
          possibleRelationships = filteredRelationships;
        }

        (0, _debug.assert)("You defined the '" + name + "' relationship on " + this + ", but multiple possible inverse relationships of type " + this + " were found on " + inverseType + ". Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses", possibleRelationships.length === 1);

        inverseName = possibleRelationships[0].name;
        inverseKind = possibleRelationships[0].kind;
      }

      return {
        type: inverseType,
        name: inverseName,
        kind: inverseKind
      };
    },


    /**
     The model's relationships as a map, keyed on the type of the
     relationship. The value of each entry is an array containing a descriptor
     for each relationship with that type, describing the name of the relationship
     as well as the type.
      For example, given the following model definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
        posts: DS.hasMany('post')
      });
     ```
      This computed property would return a map describing these
     relationships, like this:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
     import User from 'app/models/user';
     import Post from 'app/models/post';
      let relationships = Ember.get(Blog, 'relationships');
     relationships.get(User);
     //=> [ { name: 'users', kind: 'hasMany' },
     //     { name: 'owner', kind: 'belongsTo' } ]
     relationships.get(Post);
     //=> [ { name: 'posts', kind: 'hasMany' } ]
     ```
      @property relationships
     @static
     @type Ember.Map
     @readOnly
     */

    relationships: _ext.relationshipsDescriptor,

    /**
     A hash containing lists of the model's relationships, grouped
     by the relationship kind. For example, given a model with this
     definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relationshipNames = Ember.get(Blog, 'relationshipNames');
     relationshipNames.hasMany;
     //=> ['users', 'posts']
     relationshipNames.belongsTo;
     //=> ['owner']
     ```
      @property relationshipNames
     @static
     @type Object
     @readOnly
     */
    relationshipNames: _ember.default.computed(function () {
      var names = {
        hasMany: [],
        belongsTo: []
      };

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          names[meta.kind].push(name);
        }
      });

      return names;
    }),

    /**
     An array of types directly related to a model. Each type will be
     included once, regardless of the number of relationships it has with
     the model.
      For example, given a model with this definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relatedTypes = Ember.get(Blog, 'relatedTypes');
     //=> [ User, Post ]
     ```
      @property relatedTypes
     @static
     @type Ember.Array
     @readOnly
     */
    relatedTypes: _ext.relatedTypesDescriptor,

    /**
     A map whose keys are the relationships of a model and whose values are
     relationship descriptors.
      For example, given a model with this
     definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relationshipsByName = Ember.get(Blog, 'relationshipsByName');
     relationshipsByName.get('users');
     //=> { key: 'users', kind: 'hasMany', type: 'user', options: Object, isRelationship: true }
     relationshipsByName.get('owner');
     //=> { key: 'owner', kind: 'belongsTo', type: 'user', options: Object, isRelationship: true }
     ```
      @property relationshipsByName
     @static
     @type Ember.Map
     @readOnly
     */
    relationshipsByName: _ext.relationshipsByNameDescriptor,

    /**
     A map whose keys are the fields of the model and whose values are strings
     describing the kind of the field. A model's fields are the union of all of its
     attributes and relationships.
      For example:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post'),
         title: DS.attr('string')
      });
     ```
      ```js
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let fields = Ember.get(Blog, 'fields');
     fields.forEach(function(kind, field) {
        console.log(field, kind);
      });
      // prints:
     // users, hasMany
     // owner, belongsTo
     // posts, hasMany
     // title, attribute
     ```
      @property fields
     @static
     @type Ember.Map
     @readOnly
     */
    fields: _ember.default.computed(function () {
      var map = Map.create();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          map.set(name, meta.kind);
        } else if (meta.isAttribute) {
          map.set(name, 'attribute');
        }
      });

      return map;
    }).readOnly(),

    eachRelationship: function eachRelationship(callback, binding) {
      get(this, 'relationshipsByName').forEach(function (relationship, name) {
        callback.call(binding, name, relationship);
      });
    },
    eachRelatedType: function eachRelatedType(callback, binding) {
      var relationshipTypes = get(this, 'relatedTypes');

      for (var i = 0; i < relationshipTypes.length; i++) {
        var type = relationshipTypes[i];
        callback.call(binding, type);
      }
    },
    determineRelationshipType: function determineRelationshipType(knownSide, store) {
      var knownKey = knownSide.key;
      var knownKind = knownSide.kind;
      var inverse = this.inverseFor(knownKey, store);
      // let key;
      var otherKind = void 0;

      if (!inverse) {
        return knownKind === 'belongsTo' ? 'oneToNone' : 'manyToNone';
      }

      // key = inverse.name;
      otherKind = inverse.kind;

      if (otherKind === 'belongsTo') {
        return knownKind === 'belongsTo' ? 'oneToOne' : 'manyToOne';
      } else {
        return knownKind === 'belongsTo' ? 'oneToMany' : 'manyToMany';
      }
    },


    /**
     A map whose keys are the attributes of the model (properties
     described by DS.attr) and whose values are the meta object for the
     property.
      Example
      ```app/models/person.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
     ```
      ```javascript
     import Ember from 'ember';
     import Person from 'app/models/person';
      let attributes = Ember.get(Person, 'attributes')
      attributes.forEach(function(meta, name) {
        console.log(name, meta);
      });
      // prints:
     // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
     // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
     // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
     ```
      @property attributes
     @static
     @type {Ember.Map}
     @readOnly
     */
    attributes: _ember.default.computed(function () {
      var _this3 = this;

      var map = Map.create();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isAttribute) {
          (0, _debug.assert)("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + _this3.toString(), name !== 'id');

          meta.name = name;
          map.set(name, meta);
        }
      });

      return map;
    }).readOnly(),

    /**
     A map whose keys are the attributes of the model (properties
     described by DS.attr) and whose values are type of transformation
     applied to each attribute. This map does not include any
     attributes that do not have an transformation type.
      Example
      ```app/models/person.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        firstName: DS.attr(),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
     ```
      ```javascript
     import Ember from 'ember';
     import Person from 'app/models/person';
      let transformedAttributes = Ember.get(Person, 'transformedAttributes')
      transformedAttributes.forEach(function(field, type) {
        console.log(field, type);
      });
      // prints:
     // lastName string
     // birthday date
     ```
      @property transformedAttributes
     @static
     @type {Ember.Map}
     @readOnly
     */
    transformedAttributes: _ember.default.computed(function () {
      var map = Map.create();

      this.eachAttribute(function (key, meta) {
        if (meta.type) {
          map.set(key, meta.type);
        }
      });

      return map;
    }).readOnly(),

    eachAttribute: function eachAttribute(callback, binding) {
      get(this, 'attributes').forEach(function (meta, name) {
        callback.call(binding, name, meta);
      });
    },
    eachTransformedAttribute: function eachTransformedAttribute(callback, binding) {
      get(this, 'transformedAttributes').forEach(function (type, name) {
        callback.call(binding, name, type);
      });
    }
  });

  // if `Ember.setOwner` is defined, accessing `this.container` is
  // deprecated (but functional). In "standard" Ember usage, this
  // deprecation is actually created via an `.extend` of the factory
  // inside the container itself, but that only happens on models
  // with MODEL_FACTORY_INJECTIONS enabled :(
  if (_ember.default.setOwner) {
    Object.defineProperty(Model.prototype, 'container', {
      configurable: true,
      enumerable: false,
      get: function get() {
        (0, _debug.deprecate)('Using the injected `container` is deprecated. Please use the `getOwner` helper instead to access the owner of this object.', false, { id: 'ember-application.injected-container', until: '3.0.0' });

        return this.store.container;
      }
    });
  }

  if ((0, _features.default)('ds-rollback-attribute')) {
    Model.reopen({
      rollbackAttribute: function rollbackAttribute(attributeName) {
        if (attributeName in this._internalModel._attributes) {
          this.set(attributeName, this._internalModel.lastAcknowledgedValue(attributeName));
        }
      }
    });
  }

  exports.default = Model;
});