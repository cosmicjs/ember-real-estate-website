define("ember-data/-private/system/relationships/has-many", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/normalize-model-name", "ember-data/-private/system/is-array-like"], function (exports, _ember, _debug, _normalizeModelName, _isArrayLike) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = hasMany;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var get = _ember.default.get;


  /**
    `DS.hasMany` is used to define One-To-Many and Many-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).
  
    `DS.hasMany` takes an optional hash as a second parameter, currently
    supported options are:
  
    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a related model.
  
    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```
  
    #### Many-To-Many
    To declare a many-to-many relationship between two models, use
    `DS.hasMany`:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      tags: DS.hasMany('tag')
    });
    ```
  
    ```app/models/tag.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      posts: DS.hasMany('post')
    });
    ```
  
    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the singularized key name.
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      tags: DS.hasMany()
    });
    ```
  
    will lookup for a Tag type.
  
    #### Explicit Inverses
  
    Ember Data will do its best to discover which relationships map to
    one another. In the one-to-many code above, for example, Ember Data
    can figure out that changing the `comments` relationship should update
    the `post` relationship on the inverse because post is the only
    relationship to that model.
  
    However, sometimes you may have multiple `belongsTo`/`hasMany` for the
    same type. You can specify which property on the related model is
    the inverse using `DS.hasMany`'s `inverse` option:
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      onePost: DS.belongsTo('post'),
      twoPost: DS.belongsTo('post'),
      redPost: DS.belongsTo('post'),
      bluePost: DS.belongsTo('post')
    });
    ```
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment', {
        inverse: 'redPost'
      })
    });
    ```
  
    You can also specify an inverse on a `belongsTo`, which works how
    you'd expect.
  
    @namespace
    @method hasMany
    @for DS
    @param {String} type (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function hasMany(type, options) {
    if ((typeof type === "undefined" ? "undefined" : _typeof(type)) === 'object') {
      options = type;
      type = undefined;
    }

    (0, _debug.assert)("The first argument to DS.hasMany must be a string representing a model type key, not an instance of " + _ember.default.inspect(type) + ". E.g., to define a relation to the Comment model, use DS.hasMany('comment')", typeof type === 'string' || typeof type === 'undefined');

    options = options || {};

    if (typeof type === 'string') {
      type = (0, _normalizeModelName.default)(type);
    }

    // Metadata about relationships is stored on the meta of
    // the relationship. This is used for introspection and
    // serialization. Note that `key` is populated lazily
    // the first time the CP is called.
    var meta = {
      type: type,
      options: options,
      isRelationship: true,
      kind: 'hasMany',
      name: 'Has Many',
      key: null
    };

    return _ember.default.computed({
      get: function get(key) {
        return this._internalModel._relationships.get(key).getRecords();
      },
      set: function set(key, records) {
        (0, _debug.assert)("You must pass an array of records to set a hasMany relationship", (0, _isArrayLike.default)(records));
        (0, _debug.assert)("All elements of a hasMany relationship must be instances of DS.Model, you passed " + _ember.default.inspect(records), function () {
          return _ember.default.A(records).every(function (record) {
            return record.hasOwnProperty('_internalModel') === true;
          });
        }());

        var relationship = this._internalModel._relationships.get(key);
        relationship.clear();
        relationship.addRecords(records.map(function (record) {
          return get(record, '_internalModel');
        }));
        return relationship.getRecords();
      }
    }).meta(meta);
  }
});