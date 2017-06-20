define('ember-data/-private/system/references/has-many', ['exports', 'ember', 'ember-data/-private/system/references/reference', 'ember-data/-private/debug', 'ember-data/-private/features'], function (exports, _ember, _reference, _debug, _features) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var resolve = _ember.default.RSVP.resolve,
      get = _ember.default.get;


  /**
     A HasManyReference is a low level API that allows users and addon
     author to perform meta-operations on a has-many relationship.
  
     @class HasManyReference
     @namespace DS
  */
  var HasManyReference = function HasManyReference(store, parentInternalModel, hasManyRelationship) {
    this._super$constructor(store, parentInternalModel);
    this.hasManyRelationship = hasManyRelationship;
    this.type = hasManyRelationship.relationshipMeta.type;
    this.parent = parentInternalModel.recordReference;

    // TODO inverse
  };

  HasManyReference.prototype = Object.create(_reference.default.prototype);
  HasManyReference.prototype.constructor = HasManyReference;
  HasManyReference.prototype._super$constructor = _reference.default;

  /**
     This returns a string that represents how the reference will be
     looked up when it is loaded. If the relationship has a link it will
     use the "link" otherwise it defaults to "id".
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     // get the identifier of the reference
     if (commentsRef.remoteType() === "ids") {
       let ids = commentsRef.ids();
     } else if (commentsRef.remoteType() === "link") {
       let link = commentsRef.link();
     }
     ```
  
     @method remoteType
     @return {String} The name of the remote type. This should either be "link" or "ids"
  */
  HasManyReference.prototype.remoteType = function () {
    if (this.hasManyRelationship.link) {
      return "link";
    }

    return "ids";
  };

  /**
     The link Ember Data will use to fetch or reload this has-many
     relationship.
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             links: {
               related: '/posts/1/comments'
             }
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     commentsRef.link(); // '/posts/1/comments'
     ```
  
     @method link
     @return {String} The link Ember Data will use to fetch or reload this has-many relationship.
  */
  HasManyReference.prototype.link = function () {
    return this.hasManyRelationship.link;
  };

  /**
     `ids()` returns an array of the record ids in this relationship.
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     commentsRef.ids(); // ['1']
     ```
  
     @method remoteType
     @return {Array} The ids in this has-many relationship
  */
  HasManyReference.prototype.ids = function () {
    var members = this.hasManyRelationship.members.toArray();

    return members.map(function (internalModel) {
      return internalModel.id;
    });
  };

  /**
     The link Ember Data will use to fetch or reload this has-many
     relationship.
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             links: {
               related: {
                 href: '/posts/1/comments',
                 meta: {
                   count: 10
                 }
               }
             }
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     commentsRef.meta(); // { count: 10 }
     ```
  
     @method meta
     @return {Object} The meta information for the has-many relationship.
  */
  HasManyReference.prototype.meta = function () {
    return this.hasManyRelationship.meta;
  };

  /**
     `push` can be used to update the data in the relationship and Ember
     Data will treat the new data as the canonical value of this
     relationship on the backend.
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     commentsRef.ids(); // ['1']
  
     commentsRef.push([
       [{ type: 'comment', id: 2 }],
       [{ type: 'comment', id: 3 }],
     ])
  
     commentsRef.ids(); // ['2', '3']
     ```
  
     @method push
     @param {Array|Promise} objectOrPromise a promise that resolves to a JSONAPI document object describing the new value of this relationship.
     @return {DS.ManyArray}
  */
  HasManyReference.prototype.push = function (objectOrPromise) {
    var _this = this;

    return resolve(objectOrPromise).then(function (payload) {
      var array = payload;

      if ((0, _features.default)("ds-overhaul-references")) {
        (0, _debug.deprecate)("HasManyReference#push(array) is deprecated. Push a JSON-API document instead.", !Array.isArray(payload), {
          id: 'ds.references.has-many.push-array',
          until: '3.0'
        });
      }

      var useLegacyArrayPush = true;
      if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) === "object" && payload.data) {
        array = payload.data;
        useLegacyArrayPush = array.length && array[0].data;

        if ((0, _features.default)('ds-overhaul-references')) {
          (0, _debug.deprecate)("HasManyReference#push() expects a valid JSON-API document.", !useLegacyArrayPush, {
            id: 'ds.references.has-many.push-invalid-json-api',
            until: '3.0'
          });
        }
      }

      if (!(0, _features.default)('ds-overhaul-references')) {
        useLegacyArrayPush = true;
      }

      var internalModels = void 0;
      if (useLegacyArrayPush) {
        internalModels = array.map(function (obj) {
          var record = _this.store.push(obj);

          (0, _debug.runInDebug)(function () {
            var relationshipMeta = _this.hasManyRelationship.relationshipMeta;
            (0, _debug.assertPolymorphicType)(_this.internalModel, relationshipMeta, record._internalModel);
          });

          return record._internalModel;
        });
      } else {
        var records = _this.store.push(payload);
        internalModels = _ember.default.A(records).mapBy('_internalModel');

        (0, _debug.runInDebug)(function () {
          internalModels.forEach(function (internalModel) {
            var relationshipMeta = _this.hasManyRelationship.relationshipMeta;
            (0, _debug.assertPolymorphicType)(_this.internalModel, relationshipMeta, internalModel);
          });
        });
      }

      _this.hasManyRelationship.computeChanges(internalModels);

      return _this.hasManyRelationship.manyArray;
    });
  };

  HasManyReference.prototype._isLoaded = function () {
    var hasData = get(this.hasManyRelationship, 'hasData');
    if (!hasData) {
      return false;
    }

    var members = this.hasManyRelationship.members.toArray();

    return members.every(function (internalModel) {
      return internalModel.isLoaded() === true;
    });
  };

  /**
     `value()` sycronously returns the current value of the has-many
      relationship. Unlike `record.get('relationshipName')`, calling
      `value()` on a reference does not trigger a fetch if the async
      relationship is not yet loaded. If the relationship is not loaded
      it will always return `null`.
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     post.get('comments').then(function(comments) {
       commentsRef.value() === comments
     })
     ```
  
     @method value
     @return {DS.ManyArray}
  */
  HasManyReference.prototype.value = function () {
    if (this._isLoaded()) {
      return this.hasManyRelationship.manyArray;
    }

    return null;
  };

  /**
     Loads the relationship if it is not already loaded.  If the
     relationship is already loaded this method does not trigger a new
     load.
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     commentsRef.load().then(function(comments) {
       //...
     });
     ```
  
     @method load
     @return {Promise} a promise that resolves with the ManyArray in
     this has-many relationship.
  */
  HasManyReference.prototype.load = function () {
    if (!this._isLoaded()) {
      return this.hasManyRelationship.getRecords();
    }

    return resolve(this.hasManyRelationship.manyArray);
  };

  /**
     Reloads this has-many relationship.
  
     Example
  
     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
  
     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
  
     let commentsRef = post.hasMany('comments');
  
     commentsRef.reload().then(function(comments) {
       //...
     });
     ```
  
     @method reload
     @return {Promise} a promise that resolves with the ManyArray in this has-many relationship.
  */
  HasManyReference.prototype.reload = function () {
    return this.hasManyRelationship.reload();
  };

  exports.default = HasManyReference;
});