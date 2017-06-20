define('ember-data/-private/system/record-arrays/filtered-record-array', ['exports', 'ember', 'ember-data/-private/system/record-arrays/record-array'], function (exports, _ember, _recordArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = _ember.default.get;
  exports.default = _recordArray.default.extend({
    init: function init() {
      this._super.apply(this, arguments);

      this.set('filterFunction', this.get('filterFunction') || null);
      this.isLoaded = true;
    },

    /**
      The filterFunction is a function used to test records from the store to
      determine if they should be part of the record array.
       Example
       ```javascript
      var allPeople = store.peekAll('person');
      allPeople.mapBy('name'); // ["Tom Dale", "Yehuda Katz", "Trek Glowacki"]
       var people = store.filter('person', function(person) {
        if (person.get('name').match(/Katz$/)) { return true; }
      });
      people.mapBy('name'); // ["Yehuda Katz"]
       var notKatzFilter = function(person) {
        return !person.get('name').match(/Katz$/);
      };
      people.set('filterFunction', notKatzFilter);
      people.mapBy('name'); // ["Tom Dale", "Trek Glowacki"]
      ```
       @method filterFunction
      @param {DS.Model} record
      @return {Boolean} `true` if the record should be in the array
    */

    replace: function replace() {
      throw new Error('The result of a client-side filter (on ' + this.modelName + ') is immutable.');
    },


    /**
      @method updateFilter
      @private
    */
    _updateFilter: function _updateFilter() {
      if (get(this, 'isDestroying') || get(this, 'isDestroyed')) {
        return;
      }
      get(this, 'manager').updateFilter(this, this.modelName, get(this, 'filterFunction'));
    },


    updateFilter: _ember.default.observer('filterFunction', function () {
      _ember.default.run.once(this, this._updateFilter);
    })
  });
});