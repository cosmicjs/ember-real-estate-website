define('ember-bootstrap/components/base/bs-accordion/item/body', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-accordion/body'], function (exports, _ember, _body) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _body.default,
    tagName: '',

    /**
     * @property collapsed
     * @type boolean
     * @public
     */
    collapsed: null

  });
});