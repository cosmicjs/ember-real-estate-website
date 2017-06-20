define('ember-data/-private/initializers/transforms', ['exports', 'ember-data/-private/transforms'], function (exports, _transforms) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = initializeTransforms;


  /*
    Configures a registry for use with Ember-Data
    transforms.
  
    @method initializeTransforms
    @param {Ember.Registry} registry
  */
  function initializeTransforms(registry) {
    registry.register('transform:boolean', _transforms.BooleanTransform);
    registry.register('transform:date', _transforms.DateTransform);
    registry.register('transform:number', _transforms.NumberTransform);
    registry.register('transform:string', _transforms.StringTransform);
  }
});