define('ember-bootstrap/components/base/bs-dropdown', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-dropdown'], function (exports, _ember, _bsDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed,
      bind = _ember.default.run.bind;
  exports.default = _ember.default.Component.extend({
    layout: _bsDropdown.default,
    classNameBindings: ['containerClass'],

    /**
     * This property reflects the state of the dropdown, whether it is open or closed.
     *
     * @property isOpen
     * @default false
     * @type boolean
     * @private
     */
    isOpen: false,

    /**
     * By default clicking on an open dropdown menu will close it. Set this property to false for the menu to stay open.
     *
     * @property closeOnMenuClick
     * @default true
     * @type boolean
     * @public
     */
    closeOnMenuClick: true,

    /**
     * By default the dropdown menu will expand downwards. Set to 'up' to expand upwards.
     *
     * @property direction
     * @type string
     * @default 'down'
     * @public
     */
    direction: 'down',

    /**
     * Indicates the dropdown is being used as a navigation item dropdown.
     *
     * @property inNav
     * @type boolean
     * @default false
     * @private
     */
    inNav: false,

    /**
     * A computed property to generate the suiting class for the dropdown container, either "dropdown", "dropup" or "btn-group".
     *
     * @property containerClass
     * @type string
     * @readonly
     * @private
     */
    containerClass: computed('toggle.tagName', 'direction', function () {
      if (this.get('toggle.tagName') === 'button' && !this.get('toggle.block')) {
        return this.get('direction') === 'up' ? 'btn-group dropup' : 'btn-group';
      } else {
        return this.get('direction') === 'up' ? 'dropup' : 'dropdown';
      }
    }),

    /**
     * @property menuElement
     * @private
     */
    menuElement: computed(function () {
      return this.get('element').querySelector('.dropdown-menu');
    }).volatile(),

    /**
     * @property toggleElement
     * @private
     */
    toggleElement: computed.readOnly('toggle.element'),

    /**
     * Reference to the child toggle (Toggle or Button)
     *
     * @property toggle
     * @private
     */
    toggle: null,

    /**
     * Action is called when dropdown is about to be shown
     *
     * @event onShow
     * @param {*} value
     * @public
     */
    onShow: function onShow(value) {},
    // eslint-disable-line no-unused-vars

    /**
     * Action is called when dropdown is about to be hidden
     *
     * @event onHide
     * @param {*} value
     * @public
     */
    onHide: function onHide(value) {},
    // eslint-disable-line no-unused-vars

    actions: {
      toggleDropdown: function toggleDropdown() {
        if (this.get('isOpen')) {
          this.send('closeDropdown');
        } else {
          this.send('openDropdown');
        }
      },
      openDropdown: function openDropdown() {
        this.set('isOpen', true);
        this.addClickListener();
        this.get('onShow')();
      },
      closeDropdown: function closeDropdown() {
        this.set('isOpen', false);
        this.removeClickListener();
        this.get('onHide')();
      }
    },

    addClickListener: function addClickListener() {
      if (!this.clickListener) {
        this.clickListener = bind(this, this.closeOnClickHandler);
        document.addEventListener('click', this.clickListener);
      }
    },
    removeClickListener: function removeClickListener() {
      if (this.clickListener) {
        document.removeEventListener('click', this.clickListener);
        this.clickListener = null;
      }
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this.removeClickListener();
    },


    /**
     * Handler for click events to close the dropdown
     *
     * @method closeOnClickHandler
     * @param e
     * @protected
     */
    closeOnClickHandler: function closeOnClickHandler(e) {
      var target = e.target;

      var _getProperties = this.getProperties('toggleElement', 'menuElement'),
          toggleElement = _getProperties.toggleElement,
          menuElement = _getProperties.menuElement;

      if (!this.get('isDestroyed') && toggleElement && !toggleElement.contains(target) && (menuElement && !menuElement.contains(target) || this.get('closeOnMenuClick'))) {
        this.send('closeDropdown');
      }
    }
  });
});