define("ember-data/-private/system/record-arrays", ["exports", "ember-data/-private/system/record-arrays/record-array", "ember-data/-private/system/record-arrays/filtered-record-array", "ember-data/-private/system/record-arrays/adapter-populated-record-array"], function (exports, _recordArray, _filteredRecordArray, _adapterPopulatedRecordArray) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AdapterPopulatedRecordArray = exports.FilteredRecordArray = exports.RecordArray = undefined;
  exports.RecordArray = _recordArray.default;
  exports.FilteredRecordArray = _filteredRecordArray.default;
  exports.AdapterPopulatedRecordArray = _adapterPopulatedRecordArray.default;
});