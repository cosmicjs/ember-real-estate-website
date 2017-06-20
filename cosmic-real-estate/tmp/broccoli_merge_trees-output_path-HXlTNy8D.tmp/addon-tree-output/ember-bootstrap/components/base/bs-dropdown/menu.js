define('ember-bootstrap/components/base/bs-dropdown/menu', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-dropdown/menu'], function (exports, _ember, _menu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _ember.default.Component.extend({
    layout: _menu.default,

    /**
     * Defaults to a `<ul>` tag. Change for other types of dropdown menus.
     *
     * @property tagName
     * @type string
     * @default ul
     * @public
     */
    tagName: 'ul',
    classNames: ['dropdown-menu'],
    classNameBindings: ['alignClass'],

    /**
     * @property ariaRole
     * @default menu
     * @type string
     * @protected
     */
    ariaRole: 'menu',

    /**
     * Alignment of the menu, either "left" or "right"
     *
     * @property align
     * @type string
     * @default left
     * @public
     */
    align: 'left',

    alignClass: computed('align', function () {
      if (this.get('align') !== 'left') {
        return 'dropdown-menu-' + this.get('align');
      }
    })
  });
});