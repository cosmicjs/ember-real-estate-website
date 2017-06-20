define('ember-bootstrap/components/base/bs-form/element/label', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-form/element/label'], function (exports, _ember, _label) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _label.default,
    tagName: '',

    /**
     * @property label
     * @type string
     * @public
     */
    label: null,

    /**
     * @property invisibleLabel
     * @type boolean
     * @public
     */
    invisibleLabel: false,

    /**
     * @property formElementId
     * @type {String}
     * @public
     */
    formElementId: null,

    /**
     * @property labelClass
     * @type {String}
     * @public
     */
    labelClass: null
  });
});