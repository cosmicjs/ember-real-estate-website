define("ember-data/-private/transforms/number", ["exports", "ember", "ember-data/transform"], function (exports, _ember, _transform) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var empty = _ember.default.isEmpty;

  function isNumber(value) {
    return value === value && value !== Infinity && value !== -Infinity;
  }

  /**
    The `DS.NumberTransform` class is used to serialize and deserialize
    numeric attributes on Ember Data record objects. This transform is
    used when `number` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/score.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      value: DS.attr('number'),
      player: DS.belongsTo('player'),
      date: DS.attr('date')
    });
    ```
  
    @class NumberTransform
    @extends DS.Transform
    @namespace DS
   */
  exports.default = _transform.default.extend({
    deserialize: function deserialize(serialized) {
      var transformed = void 0;

      if (empty(serialized)) {
        return null;
      } else {
        transformed = Number(serialized);

        return isNumber(transformed) ? transformed : null;
      }
    },
    serialize: function serialize(deserialized) {
      var transformed = void 0;

      if (empty(deserialized)) {
        return null;
      } else {
        transformed = Number(deserialized);

        return isNumber(transformed) ? transformed : null;
      }
    }
  });
});