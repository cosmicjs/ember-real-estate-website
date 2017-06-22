define('ember-bootstrap/mixins/control-attributes', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Mixin.create({
    attributeBindings: ['name', 'autofocus', 'disabled', 'readonly', 'required', 'tabindex', 'form', 'title', 'ariaDescribedBy:aria-describedby'],
    tagName: 'input'
  });
});