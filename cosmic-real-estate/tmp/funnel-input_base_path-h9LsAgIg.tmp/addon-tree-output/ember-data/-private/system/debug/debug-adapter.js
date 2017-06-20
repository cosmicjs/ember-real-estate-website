define('ember-data/-private/system/debug/debug-adapter', ['exports', 'ember', 'ember-data/model'], function (exports, _ember, _model) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
    @module ember-data
  */
  var capitalize = _ember.default.String.capitalize;
  var underscore = _ember.default.String.underscore;
  var assert = _ember.default.assert,
      get = _ember.default.get;
  exports.default = _ember.default.DataAdapter.extend({
    getFilters: function getFilters() {
      return [{ name: 'isNew', desc: 'New' }, { name: 'isModified', desc: 'Modified' }, { name: 'isClean', desc: 'Clean' }];
    },
    detect: function detect(typeClass) {
      return typeClass !== _model.default && _model.default.detect(typeClass);
    },
    columnsForType: function columnsForType(typeClass) {
      var columns = [{
        name: 'id',
        desc: 'Id'
      }];
      var count = 0;
      var self = this;
      get(typeClass, 'attributes').forEach(function (meta, name) {
        if (count++ > self.attributeLimit) {
          return false;
        }
        var desc = capitalize(underscore(name).replace('_', ' '));
        columns.push({ name: name, desc: desc });
      });
      return columns;
    },
    getRecords: function getRecords(modelClass, modelName) {
      if (arguments.length < 2) {
        // Legacy Ember.js < 1.13 support
        var containerKey = modelClass._debugContainerKey;
        if (containerKey) {
          var match = containerKey.match(/model:(.*)/);
          if (match) {
            modelName = match[1];
          }
        }
      }
      assert("Cannot find model name. Please upgrade to Ember.js >= 1.13 for Ember Inspector support", !!modelName);
      return this.get('store').peekAll(modelName);
    },
    getRecordColumnValues: function getRecordColumnValues(record) {
      var _this = this;

      var count = 0;
      var columnValues = { id: get(record, 'id') };

      record.eachAttribute(function (key) {
        if (count++ > _this.attributeLimit) {
          return false;
        }
        columnValues[key] = get(record, key);
      });
      return columnValues;
    },
    getRecordKeywords: function getRecordKeywords(record) {
      var keywords = [];
      var keys = _ember.default.A(['id']);
      record.eachAttribute(function (key) {
        return keys.push(key);
      });
      keys.forEach(function (key) {
        return keywords.push(get(record, key));
      });
      return keywords;
    },
    getRecordFilterValues: function getRecordFilterValues(record) {
      return {
        isNew: record.get('isNew'),
        isModified: record.get('hasDirtyAttributes') && !record.get('isNew'),
        isClean: !record.get('hasDirtyAttributes')
      };
    },
    getRecordColor: function getRecordColor(record) {
      var color = 'black';
      if (record.get('isNew')) {
        color = 'green';
      } else if (record.get('hasDirtyAttributes')) {
        color = 'blue';
      }
      return color;
    },
    observeRecord: function observeRecord(record, recordUpdated) {
      var releaseMethods = _ember.default.A();
      var keysToObserve = _ember.default.A(['id', 'isNew', 'hasDirtyAttributes']);

      record.eachAttribute(function (key) {
        return keysToObserve.push(key);
      });
      var adapter = this;

      keysToObserve.forEach(function (key) {
        var handler = function handler() {
          recordUpdated(adapter.wrapRecord(record));
        };
        _ember.default.addObserver(record, key, handler);
        releaseMethods.push(function () {
          _ember.default.removeObserver(record, key, handler);
        });
      });

      var release = function release() {
        releaseMethods.forEach(function (fn) {
          return fn();
        });
      };

      return release;
    }
  });
});