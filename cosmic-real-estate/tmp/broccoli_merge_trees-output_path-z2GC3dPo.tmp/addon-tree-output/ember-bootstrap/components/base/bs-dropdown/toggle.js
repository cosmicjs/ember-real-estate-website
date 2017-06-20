define('ember-bootstrap/components/base/bs-dropdown/toggle', ['exports', 'ember', 'ember-bootstrap/mixins/dropdown-toggle'], function (exports, _ember, _dropdownToggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _ember.default.Component.extend(_dropdownToggle.default, {
    /**
     * Defaults to a `<a>` tag. Change for other types of dropdown toggles.
     *
     * @property tagName
     * @type string
     * @default a
     * @public
     */
    tagName: 'a',

    attributeBindings: ['href'],

    /**
     * Computed property to generate a `href="#"` attribute when `tagName` is "a".
     *
     * @property href
     * @type string
     * @readonly
     * @private
     */
    href: computed('tagName', function () {
      if (this.get('tagName').toUpperCase() === 'A') {
        return '#';
      }
    }),

    /**
     * When clicking the toggle this action is called.
     *
     * @event onClick
     * @param {*} value
     * @public
     */
    onClick: function onClick() {},
    click: function click(e) {
      e.preventDefault();
      this.get('onClick')();
    }
  });
});