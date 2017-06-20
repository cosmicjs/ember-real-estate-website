define('ember-data/-private/system/relationship-meta', ['exports', 'ember-inflector', 'ember-data/-private/system/normalize-model-name'], function (exports, _emberInflector, _normalizeModelName) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.typeForRelationshipMeta = typeForRelationshipMeta;
  exports.relationshipFromMeta = relationshipFromMeta;
  function typeForRelationshipMeta(meta) {
    var modelName = void 0;

    modelName = meta.type || meta.key;
    if (meta.kind === 'hasMany') {
      modelName = (0, _emberInflector.singularize)((0, _normalizeModelName.default)(modelName));
    }
    return modelName;
  }

  function relationshipFromMeta(meta) {
    return {
      key: meta.key,
      kind: meta.kind,
      type: typeForRelationshipMeta(meta),
      options: meta.options,
      name: meta.name,
      parentType: meta.parentType,
      isRelationship: true
    };
  }
});