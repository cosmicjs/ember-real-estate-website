define('ember-bootstrap/components/base/bs-form/element/help-text', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-form/element/help-text'], function (exports, _ember, _helpText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _helpText.default,

    /**
     * @property text
     * @type {string}
     * @public
     */
    text: null
  });
});