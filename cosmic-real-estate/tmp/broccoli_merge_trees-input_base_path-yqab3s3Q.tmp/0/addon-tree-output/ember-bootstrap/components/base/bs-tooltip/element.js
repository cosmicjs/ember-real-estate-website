define('ember-bootstrap/components/base/bs-tooltip/element', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-tooltip/element'], function (exports, _ember, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _element.default,

    classNames: ['tooltip'],
    classNameBindings: ['fade'],
    ariaRole: 'tooltip',

    /**
     * @property placement
     * @type string
     * @default 'top'
     * @public
     */
    placement: 'top',

    /**
     * @property fade
     * @type boolean
     * @default true
     * @public
     */
    fade: true,

    /**
     * @property showHelp
     * @type boolean
     * @default false
     * @public
     */
    showHelp: false
  });
});