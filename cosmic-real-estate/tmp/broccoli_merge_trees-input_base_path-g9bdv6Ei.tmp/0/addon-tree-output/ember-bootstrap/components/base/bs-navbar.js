define('ember-bootstrap/components/base/bs-navbar', ['exports', 'ember', 'ember-bootstrap/mixins/type-class', 'ember-bootstrap/templates/components/bs-navbar'], function (exports, _ember, _typeClass, _bsNavbar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend(_typeClass.default, {
    layout: _bsNavbar.default,

    tagName: 'nav',
    classNames: ['navbar'],
    classNameBindings: ['positionClass'],

    classTypePrefix: 'navbar',

    /**
     * Manages the state for the responsive menu between the toggle and the content.
     *
     * @property collapsed
     * @type boolean
     * @default true
     * @protected
     */
    collapsed: true,

    /**
     * Controls whether the wrapping div is a fluid container or not.
     *
     * @property fluid
     * @type boolean
     * @default true
     * @public
     */
    fluid: true,

    /**
     * Specifies the position classes for the navbar, currently supporting none, "fixed-top", "fixed-bottom", and
     * either "static-top" (BS3) or "sticky-top" (BS4).
     * See the [bootstrap docs](http://getbootstrap.com/components/#navbar-fixed-top) for details.
     *
     * @property position
     * @type String
     * @default null
     * @public
     */
    position: null,

    positionClass: _ember.default.computed('position', function () {
      var position = this.get('position');
      var validPositions = this.get('_validPositions');
      var positionPrefix = this.get('_positionPrefix');

      if (validPositions.indexOf(position) === -1) {
        return null;
      }

      return '' + positionPrefix + position;
    }),

    actions: {
      toggleNavbar: function toggleNavbar() {
        this.toggleProperty('collapsed');
      }
    }

    /**
     * Bootstrap 4 Only: Defines the responsive toggle breakpoint size. Options are the standard
     * two character Bootstrap size abbreviations. Used to set the `navbar-toggleable-*`
     * class.
     *
     * @property toggleBreakpoint
     * @type String
     * @default 'md'
     * @public
     */

    /**
     * Bootstrap 4 Only: Sets the background color for the navbar. Can be any color
     * in the set that composes the `bg-*` classes and can be extended by creating your
     * own `bg-*` classes.
     *
     * @property backgroundColor
     * @type String
     * @default 'faded'
     * @public
     */
  });
});