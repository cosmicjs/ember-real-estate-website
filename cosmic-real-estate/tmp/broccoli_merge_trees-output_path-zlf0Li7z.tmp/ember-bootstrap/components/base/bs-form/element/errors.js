define('ember-bootstrap/components/base/bs-form/element/errors', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-form/element/errors'], function (exports, _ember, _errors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _errors.default,
    tagName: '',

    /**
     * @property show
     * @type {Boolean}
     * @public
     */
    show: false,

    /**
     * @property messages
     * @type {Ember.Array}
     * @public
     */
    messages: null
  });
});