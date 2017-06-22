define('ember-data/-private/system/references', ['exports', 'ember-data/-private/system/references/record', 'ember-data/-private/system/references/belongs-to', 'ember-data/-private/system/references/has-many'], function (exports, _record, _belongsTo, _hasMany) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HasManyReference = exports.BelongsToReference = exports.RecordReference = undefined;
  exports.RecordReference = _record.default;
  exports.BelongsToReference = _belongsTo.default;
  exports.HasManyReference = _hasMany.default;
});