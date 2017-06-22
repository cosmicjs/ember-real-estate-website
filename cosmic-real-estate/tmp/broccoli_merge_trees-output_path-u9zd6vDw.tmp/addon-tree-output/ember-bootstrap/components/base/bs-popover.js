define('ember-bootstrap/components/base/bs-popover', ['exports', 'ember', 'ember-bootstrap/components/base/bs-contextual-help', 'ember-bootstrap/templates/components/bs-popover'], function (exports, _ember, _bsContextualHelp, _bsPopover) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _bsContextualHelp.default.extend({
    layout: _bsPopover.default,

    /**
     * @property placement
     * @type string
     * @default 'right'
     * @public
     */
    placement: 'right',

    /**
     * @property triggerEvents
     * @type array|string
     * @default 'click'
     * @public
     */
    triggerEvents: 'click',

    /**
     * The DOm element of the arrow element.
     *
     * @property arrowElement
     * @type object
     * @readonly
     * @private
     */
    arrowElement: computed('overlayElement', function () {
      return this.get('overlayElement').querySelector('.arrow');
    })
  });
});