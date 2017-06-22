define('ember-bootstrap/components/base/bs-form/element/control', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({

    /**
     * @property value
     * @public
     */
    value: null,

    /**
     * @property ariaDescribedBy
     * @type {string}
     * @public
     */
    ariaDescribedBy: null,

    /**
     * This action is called whenever the `value` changes
     *
     * @event onChange
     * @param {*} value
     * @public
     */
    onChange: function onChange() {}
  });
});