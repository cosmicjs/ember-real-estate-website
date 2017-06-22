define('ember-data/-private/system/promise-proxies', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PromiseManyArray = exports.PromiseObject = exports.PromiseArray = undefined;
  exports.promiseObject = promiseObject;
  exports.promiseArray = promiseArray;
  exports.proxyToContent = proxyToContent;
  exports.promiseManyArray = promiseManyArray;
  var get = _ember.default.get,
      Promise = _ember.default.RSVP.Promise;


  /**
    A `PromiseArray` is an object that acts like both an `Ember.Array`
    and a promise. When the promise is resolved the resulting value
    will be set to the `PromiseArray`'s `content` property. This makes
    it easy to create data bindings with the `PromiseArray` that will be
    updated when the promise resolves.
  
    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).
  
    Example
  
    ```javascript
    let promiseArray = DS.PromiseArray.create({
      promise: $.getJSON('/some/remote/data.json')
    });
  
    promiseArray.get('length'); // 0
  
    promiseArray.then(function() {
      promiseArray.get('length'); // 100
    });
    ```
  
    @class PromiseArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseArray = exports.PromiseArray = _ember.default.ArrayProxy.extend(_ember.default.PromiseProxyMixin);

  /**
    A `PromiseObject` is an object that acts like both an `Ember.Object`
    and a promise. When the promise is resolved, then the resulting value
    will be set to the `PromiseObject`'s `content` property. This makes
    it easy to create data bindings with the `PromiseObject` that will
    be updated when the promise resolves.
  
    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).
  
    Example
  
    ```javascript
    let promiseObject = DS.PromiseObject.create({
      promise: $.getJSON('/some/remote/data.json')
    });
  
    promiseObject.get('name'); // null
  
    promiseObject.then(function() {
      promiseObject.get('name'); // 'Tomster'
    });
    ```
  
    @class PromiseObject
    @namespace DS
    @extends Ember.ObjectProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseObject = exports.PromiseObject = _ember.default.ObjectProxy.extend(_ember.default.PromiseProxyMixin);

  function promiseObject(promise, label) {
    return PromiseObject.create({
      promise: Promise.resolve(promise, label)
    });
  }

  function promiseArray(promise, label) {
    return PromiseArray.create({
      promise: Promise.resolve(promise, label)
    });
  }

  /**
    A PromiseManyArray is a PromiseArray that also proxies certain method calls
    to the underlying manyArray.
    Right now we proxy:
  
      * `reload()`
      * `createRecord()`
      * `on()`
      * `one()`
      * `trigger()`
      * `off()`
      * `has()`
  
    @class PromiseManyArray
    @namespace DS
    @extends Ember.ArrayProxy
  */

  function proxyToContent(method) {
    return function () {
      var _get;

      return (_get = get(this, 'content'))[method].apply(_get, arguments);
    };
  }

  var PromiseManyArray = exports.PromiseManyArray = PromiseArray.extend({
    reload: function reload() {
      (0, _debug.assert)('You are trying to reload an async manyArray before it has been created', get(this, 'content'));
      this.set('promise', this.get('content').reload());
      return this;
    },


    createRecord: proxyToContent('createRecord'),

    on: proxyToContent('on'),

    one: proxyToContent('one'),

    trigger: proxyToContent('trigger'),

    off: proxyToContent('off'),

    has: proxyToContent('has')
  });

  function promiseManyArray(promise, label) {
    return PromiseManyArray.create({
      promise: Promise.resolve(promise, label)
    });
  }
});