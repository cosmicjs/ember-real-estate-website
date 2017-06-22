define('ember-bootstrap/components/base/bs-button', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-button', 'ember-bootstrap/mixins/type-class', 'ember-bootstrap/mixins/size-class'], function (exports, _ember, _bsButton, _typeClass, _sizeClass) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed,
      observer = _ember.default.observer;
  exports.default = _ember.default.Component.extend(_typeClass.default, _sizeClass.default, {
    layout: _bsButton.default,
    tagName: 'button',
    classNames: ['btn'],
    classNameBindings: ['active', 'block:btn-block'],

    /**
     * @property classTypePrefix
     * @type String
     * @default 'btn'
     * @private
     */
    classTypePrefix: 'btn',

    attributeBindings: ['disabled', 'buttonType:type', 'title'],

    /**
     * Default label of the button. Not need if used as a block component
     *
     * @property defaultText
     * @type string
     * @public
     */
    defaultText: null,

    /**
     * Property to disable the button
     *
     * @property disabled
     * @type boolean
     * @default false
     * @public
     */
    disabled: false,

    /**
     * Set the type of the button, either 'button' or 'submit'
     *
     * @property buttonType
     * @type String
     * @default 'button'
     * @public
     */
    buttonType: 'button',

    /**
     * Set the 'active' class to apply active/pressed CSS styling
     *
     * @property active
     * @type boolean
     * @default false
     * @public
     */
    active: false,

    /**
     * Property for block level buttons
     *
     * See the [Bootstrap docs](http://getbootstrap.com/css/#buttons-sizes)
     * @property block
     * @type boolean
     * @default false
     * @public
     */
    block: false,

    /**
     * If button is active and this is set, the icon property will match this property
     *
     * @property iconActive
     * @type String
     * @public
     */
    iconActive: null,

    /**
     * If button is inactive and this is set, the icon property will match this property
     *
     * @property iconInactive
     * @type String
     * @public
     */
    iconInactive: null,

    /**
     * Class(es) (e.g. glyphicons or font awesome) to use as a button icon
     * This will render a <i class="{{icon}}"></i> element in front of the button's label
     *
     * @property icon
     * @type String
     * @readonly
     * @protected
     */
    icon: computed('active', function () {
      if (this.get('active')) {
        return this.get('iconActive');
      } else {
        return this.get('iconInactive');
      }
    }),

    /**
     * Supply a value that will be associated with this button. This will be send
     * as a parameter of the default action triggered when clicking the button
     *
     * @property value
     * @type any
     * @public
     */
    value: null,

    /**
     * State of the button. The button's label (if not used as a block component) will be set to the
     * `<state>Text` property.
     * This property will automatically be set when using a click action that supplies the callback with an promise
     *
     * @property textState
     * @type String
     * @default 'default'
     * @protected
     */
    textState: 'default',

    /**
     * Set this to true to reset the state. A typical use case is to bind this attribute with ember-data isDirty flag.
     *
     * @property reset
     * @type boolean
     * @public
     */
    reset: null,

    /**
     * The HTML title attribute
     *
     * @property title
     * @type string
     * @public
     */
    title: null,

    /**
     * When clicking the button this action is called with the value of the button (that is the value of the "value" property).
     * Return a promise object, and the buttons state will automatically set to "pending", "resolved" and/or "rejected".
     *
     * @event onClick
     * @param {*} value
     * @public
     */
    onClick: function onClick(value) {},
    // eslint-disable-line no-unused-vars

    /**
     * This will reset the state property to 'default', and with that the button's label to defaultText
     *
     * @method resetState
     * @protected
     */
    resetState: function resetState() {
      this.set('textState', 'default');
    },


    resetObserver: observer('reset', function () {
      if (this.get('reset')) {
        _ember.default.run.scheduleOnce('actions', this, function () {
          this.set('textState', 'default');
        });
      }
    }),

    text: computed('textState', 'defaultText', 'pendingText', 'resolvedText', 'rejectedText', function () {
      return this.getWithDefault(this.get('textState') + 'Text', this.get('defaultText'));
    }),

    /**
     * @method click
     * @private
     */
    click: function click() {
      var _this = this;

      var promise = this.get('onClick')(this.get('value'));
      if (promise && typeof promise.then === 'function') {
        this.set('textState', 'pending');
        promise.then(function () {
          if (!_this.get('isDestroyed')) {
            _this.set('textState', 'resolved');
          }
        }, function () {
          if (!_this.get('isDestroyed')) {
            _this.set('textState', 'rejected');
          }
        });
      }
    },
    init: function init() {
      this._super.apply(this, arguments);
      this.get('reset');
    }
  });
});