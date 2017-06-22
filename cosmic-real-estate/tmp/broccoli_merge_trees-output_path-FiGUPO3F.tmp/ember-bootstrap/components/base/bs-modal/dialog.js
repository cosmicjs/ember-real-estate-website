define('ember-bootstrap/components/base/bs-modal/dialog', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-modal/dialog'], function (exports, _ember, _dialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _ember.default.Component.extend({
    layout: _dialog.default,
    classNames: ['modal'],
    classNameBindings: ['fade'],
    attributeBindings: ['tabindex'],
    ariaRole: 'dialog',
    tabindex: '-1',

    /**
     * Set to false to disable fade animations.
     *
     * @property fade
     * @type boolean
     * @default true
     * @public
     */
    fade: true,

    /**
     * Used to apply Bootstrap's visibility classes
     *
     * @property showModal
     * @type boolean
     * @default false
     * @private
     */
    showModal: false,

    /**
     * Closes the modal when escape key is pressed.
     *
     * @property keyboard
     * @type boolean
     * @default true
     * @public
     */
    keyboard: true,

    /**
     * Property for size styling, set to null (default), 'lg' or 'sm'
     *
     * Also see the [Bootstrap docs](http://getbootstrap.com/javascript/#modals-sizes)
     *
     * @property size
     * @type String
     * @public
     */
    size: null,

    /**
     * If true clicking on the backdrop will close the modal.
     *
     * @property backdropClose
     * @type boolean
     * @default true
     * @public
     */
    backdropClose: true,

    /**
     * @event onClose
     * @public
     */
    onClose: function onClose() {},


    /**
     * Name of the size class
     *
     * @property sizeClass
     * @type string
     * @readOnly
     * @private
     */
    sizeClass: computed('size', function () {
      var size = this.get('size');
      return _ember.default.isBlank(size) ? null : 'modal-' + size;
    }).readOnly(),

    keyDown: function keyDown(e) {
      var code = e.keyCode || e.which;
      if (code === 27 && this.get('keyboard')) {
        this.get('onClose')();
      }
    },
    click: function click(e) {
      if (!e.target.classList.contains('modal') || !this.get('backdropClose')) {
        return;
      }
      this.get('onClose')();
    }
  });
});