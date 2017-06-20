define('ember-data/-private/utils', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getOwner = exports.modelHasAttributeOrRelationshipNamedType = undefined;


  var get = _ember.default.get;

  /*
    Check if the passed model has a `type` attribute or a relationship named `type`.
  
    @method modelHasAttributeOrRelationshipNamedType
    @param modelClass
   */
  function modelHasAttributeOrRelationshipNamedType(modelClass) {
    return get(modelClass, 'attributes').has('type') || get(modelClass, 'relationshipsByName').has('type');
  }

  /*
    ember-container-inject-owner is a new feature in Ember 2.3 that finally provides a public
    API for looking items up.  This function serves as a super simple polyfill to avoid
    triggering deprecations.
   */
  function getOwner(context) {
    var owner = void 0;

    if (_ember.default.getOwner) {
      owner = _ember.default.getOwner(context);
    } else if (context.container) {
      owner = context.container;
    }

    if (owner && owner.lookupFactory && !owner._lookupFactory) {
      // `owner` is a container, we are just making this work
      owner._lookupFactory = owner.lookupFactory;
      owner.register = function () {
        var registry = owner.registry || owner._registry || owner;

        return registry.register.apply(registry, arguments);
      };
    }

    return owner;
  }

  exports.modelHasAttributeOrRelationshipNamedType = modelHasAttributeOrRelationshipNamedType;
  exports.getOwner = getOwner;
});