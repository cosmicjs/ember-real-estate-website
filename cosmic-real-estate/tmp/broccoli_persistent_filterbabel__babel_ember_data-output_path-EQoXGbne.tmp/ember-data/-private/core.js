define('ember-data/-private/core', ['exports', 'ember', 'ember-data/version'], function (exports, _ember, _version) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
    @module ember-data
  */

  /**
    All Ember Data classes, methods and functions are defined inside of this namespace.
  
    @class DS
    @static
  */

  /**
    @property VERSION
    @type String
    @static
  */
  var DS = _ember.default.Namespace.create({
    VERSION: _version.default,
    name: "DS"
  });

  if (_ember.default.libraries) {
    _ember.default.libraries.registerCoreLibrary('Ember Data', DS.VERSION);
  }

  exports.default = DS;
});