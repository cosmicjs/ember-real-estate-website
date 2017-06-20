define('ember-bootstrap/mixins/sub-component', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Mixin.create({
    targetObject: _ember.default.computed.alias('parentView')
  });
});