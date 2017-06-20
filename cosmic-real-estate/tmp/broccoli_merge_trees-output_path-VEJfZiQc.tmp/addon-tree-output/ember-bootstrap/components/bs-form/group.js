define('ember-bootstrap/components/bs-form/group', ['exports', 'ember', 'ember-bootstrap/components/base/bs-form/group'], function (exports, _ember, _group) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _group.default.extend({
    classNameBindings: ['hasFeedback'],

    classTypePrefix: 'form-group',

    _validationType: computed.readOnly('validation')
  });
});