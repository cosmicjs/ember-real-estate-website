define('ember-bootstrap/components/base/bs-contextual-help', ['exports', 'ember', 'ember-bootstrap/mixins/transition-support', 'ember-bootstrap/utils/get-position', 'ember-bootstrap/utils/get-calculated-offset', 'ember-bootstrap/utils/get-parent', 'ember-bootstrap/utils/set-offset', 'ember-bootstrap/utils/transition-end'], function (exports, _ember, _transitionSupport, _getPosition, _getCalculatedOffset, _getParent, _setOffset, _transitionEnd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var assert = _ember.default.assert,
      Component = _ember.default.Component,
      computed = _ember.default.computed,
      guidFor = _ember.default.guidFor,
      isArray = _ember.default.isArray,
      isBlank = _ember.default.isBlank,
      observer = _ember.default.observer,
      run = _ember.default.run,
      _Ember$run = _ember.default.run,
      later = _Ember$run.later,
      cancel = _Ember$run.cancel,
      schedule = _Ember$run.schedule,
      next = _Ember$run.next;


  var InState = _ember.default.Object.extend({
    hover: false,
    focus: false,
    click: false,
    showHelp: computed.or('hover', 'focus', 'click')
  });

  /**
  
   @class Components.ContextualHelp
   @namespace Components
   @extends Ember.Component
   @uses Mixins.TransitionSupport
   @private
   */
  exports.default = Component.extend(_transitionSupport.default, {
    tagName: '',

    /**
     * @property title
     * @type string
     * @public
     */
    title: null,

    /**
     * How to position the tooltip/popover - top | bottom | left | right
     *
     * @property title
     * @type string
     * @default 'top'
     * @public
     */
    placement: 'top',

    _placement: computed.reads('placement'),

    /**
     * When `true` it will dynamically reorient the tooltip/popover. For example, if `placement` is "left", the
     * tooltip/popover will display to the left when possible, otherwise it will display right.
     *
     * @property autoPlacement
     * @type boolean
     * @default false
     * @public
     */
    autoPlacement: false,

    /**
     * You can programmatically show the tooltip/popover by setting this to `true`
     *
     * @property visible
     * @type boolean
     * @default false
     * @public
     */
    visible: false,

    /**
     * @property inDom
     * @type boolean
     * @private
     */
    inDom: computed.reads('visible'),

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
     * Used to apply Bootstrap's visibility class
     *
     * @property showHelp
     * @type boolean
     * @default false
     * @private
     */
    showHelp: computed.reads('visible'),

    /**
     * Delay showing and hiding the tooltip/popover (ms). Individual delays for showing and hiding can be specified by using the
     * `delayShow` and `delayHide` properties.
     *
     * @property delay
     * @type number
     * @default 0
     * @public
     */
    delay: 0,

    /**
     * Delay showing the tooltip/popover. This property overrides the general delay set with the `delay` property.
     *
     * @property delayShow
     * @type number
     * @default 0
     * @public
     */
    delayShow: computed.reads('delay'),

    /**
     * Delay hiding the tooltip/popover. This property overrides the general delay set with the `delay` property.
     *
     * @property delayHide
     * @type number
     * @default 0
     * @public
     */
    delayHide: computed.reads('delay'),

    hasDelayShow: computed.gt('delayShow', 0),
    hasDelayHide: computed.gt('delayHide', 0),

    /**
     * The duration of the fade transition
     *
     * @property transitionDuration
     * @type number
     * @default 150
     * @public
     */
    transitionDuration: 150,

    /**
     * Keeps the tooltip/popover within the bounds of this element when `autoPlacement` is true. Can be any valid CSS selector.
     *
     * @property viewportSelector
     * @type string
     * @default 'body'
     * @see viewportPadding
     * @see autoPlacement
     * @public
     */
    viewportSelector: 'body',

    /**
     * Take a padding into account for keeping the tooltip/popover within the bounds of the element given by `viewportSelector`.
     *
     * @property viewportPadding
     * @type number
     * @default 0
     * @see viewportSelector
     * @see autoPlacement
     * @public
     */
    viewportPadding: 0,

    /**
     * The id of the overlay element.
     *
     * @property overlayId
     * @type string
     * @readonly
     * @private
     */
    overlayId: computed(function () {
      return 'overlay-' + guidFor(this);
    }),

    /**
     * The DOM element of the overlay element.
     *
     * @property overlayElement
     * @type object
     * @readonly
     * @private
     */
    overlayElement: computed('overlayId', function () {
      return document.getElementById(this.get('overlayId'));
    }).volatile(),

    /**
     * The DOM element of the arrow element.
     *
     * @property arrowElement
     * @type object
     * @readonly
     * @private
     */
    arrowElement: null,

    /**
     * The DOM element of the viewport element.
     *
     * @property viewportElement
     * @type object
     * @readonly
     * @private
     */
    viewportElement: computed('viewportSelector', function () {
      return document.querySelector(this.get('viewportSelector'));
    }),

    /**
     * The DOM element that triggers the tooltip/popover. By default it is the parent element of this component.
     * You can set this to any CSS selector to have any other element trigger the tooltip/popover.
     * With the special value of "parentView" you can attach the tooltip/popover to the parent component's element.
     *
     * @property triggerElement
     * @type string
     * @public
     */
    triggerElement: null,

    /**
     * @property triggerTargetElement
     * @type {object}
     * @private
     */
    triggerTargetElement: computed('triggerElement', function () {
      var triggerElement = this.get('triggerElement');
      var el = void 0;

      if (isBlank(triggerElement)) {
        el = (0, _getParent.default)(this);
      } else if (triggerElement === 'parentView') {
        el = this.get('parentView.element');
      } else {
        el = document.querySelector(triggerElement);
      }
      assert('Trigger element for tooltip/popover must be present', el);
      return el;
    }),

    /**
     * The event(s) that should trigger the tooltip/popover - click | hover | focus.
     * You can set this to a single event or multiple events, given as an array or a string separated by spaces.
     *
     * @property triggerEvents
     * @type array|string
     * @default 'hover focus'
     * @public
     */
    triggerEvents: 'hover focus',

    _triggerEvents: computed('triggerEvents', function () {
      var events = this.get('triggerEvents');
      if (!isArray(events)) {
        events = events.split(' ');
      }

      return events.map(function (event) {
        switch (event) {
          case 'hover':
            return ['mouseenter', 'mouseleave'];
          case 'focus':
            return ['focusin', 'focusout'];
          default:
            return event;
        }
      });
    }),

    /**
     * If true component will render in place, rather than be wormholed.
     *
     * @property renderInPlace
     * @type boolean
     * @default false
     * @public
     */
    renderInPlace: false,

    /**
     * @property _renderInPlace
     * @type boolean
     * @private
     */
    _renderInPlace: computed('renderInPlace', function () {
      return this.get('renderInPlace') || typeof document === 'undefined' || !document.getElementById('ember-bootstrap-wormhole');
    }),

    /**
     * Current hover state, 'in', 'out' or null
     *
     * @property hoverState
     * @type string
     * @private
     */
    hoverState: null,

    /**
     * Current state for events
     *
     * @property inState
     * @type {InState}
     * @private
     */
    inState: computed(function () {
      return InState.create();
    }),

    /**
     * Ember.run timer
     *
     * @property timer
     * @private
     */
    timer: null,

    /**
     * This action is called immediately when the tooltip/popover is about to be shown.
     *
     * @event onShow
     * @public
     */
    onShow: function onShow() {},


    /**
     * This action will be called when the tooltip/popover has been made visible to the user (will wait for CSS transitions to complete).
     *
     * @event onShown
     * @public
     */
    onShown: function onShown() {},


    /**
     * This action is called immediately when the tooltip/popover is about to be hidden.
     *
     * @event onHide
     * @public
     */
    onHide: function onHide() {},


    /**
     * This action is called when the tooltip/popover has finished being hidden from the user (will wait for CSS transitions to complete).
     *
     * @event onHidden
     * @public
     */
    onHidden: function onHidden() {},


    /**
     * Called when a show event has been received
     *
     * @method enter
     * @param e
     * @private
     */
    enter: function enter(e) {
      if (e) {
        var eventType = e.type === 'focusin' ? 'focus' : 'hover';
        this.get('inState').set(eventType, true);
      }

      if (this.get('showHelp') || this.get('hoverState') === 'in') {
        this.set('hoverState', 'in');
        return;
      }

      cancel(this.timer);

      this.set('hoverState', 'in');

      if (!this.get('hasDelayShow')) {
        return this.show();
      }

      this.timer = later(this, function () {
        if (this.get('hoverState') === 'in') {
          this.show();
        }
      }, this.get('delayShow'));
    },


    /**
     * Called when a hide event has been received
     *
     * @method leave
     * @param e
     * @private
     */
    leave: function leave(e) {
      if (e) {
        var eventType = e.type === 'focusout' ? 'focus' : 'hover';
        this.get('inState').set(eventType, false);
      }

      if (this.get('inState.showHelp')) {
        return;
      }

      cancel(this.timer);

      this.set('hoverState', 'out');

      if (!this.get('hasDelayHide')) {
        return this.hide();
      }

      this.timer = later(this, function () {
        if (this.get('hoverState') === 'out') {
          this.hide();
        }
      }, this.get('delayHide'));
    },


    /**
     * Called for a click event
     *
     * @method toggle
     * @param e
     * @private
     */
    toggle: function toggle(e) {
      if (e) {
        this.get('inState').toggleProperty('click');
        if (this.get('inState.showHelp')) {
          this.enter();
        } else {
          this.leave();
        }
      } else {
        if (this.get('showHelp')) {
          this.leave();
        } else {
          this.enter();
        }
      }
    },


    /**
     * Show the tooltip/popover
     *
     * @method show
     * @private
     */
    show: function show() {
      if (this.get('isDestroyed')) {
        return;
      }

      if (false === this.get('onShow')(this)) {
        return;
      }

      // this waits for the tooltip/popover element to be created. when animating a wormholed tooltip/popover we need to wait until
      // ember-wormhole has moved things in the DOM for the animation to be correct, so use Ember.run.next in this case
      var delayFn = !this.get('_renderInPlace') && this.get('fade') ? next : function (target, fn) {
        schedule('afterRender', target, fn);
      };

      this.set('inDom', true);
      delayFn(this, this._show);
    },
    _show: function _show() {
      var skipTransition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var element = this.get('triggerTargetElement');
      var placement = this.get('placement');

      // this.$element.attr('aria-describedby', tipId) @todo ?

      var tip = this.get('overlayElement');
      tip.style.top = 0;
      tip.style.left = 0;
      tip.style.display = 'block';

      var pos = (0, _getPosition.default)(element);
      var actualWidth = tip.offsetWidth;
      var actualHeight = tip.offsetHeight;

      if (this.get('autoPlacement')) {
        var viewportDim = (0, _getPosition.default)(this.get('viewportElement'));

        placement = placement === 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement === 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement === 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement === 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;
      }

      this.set('_placement', placement);

      var calculatedOffset = (0, _getCalculatedOffset.default)(placement, pos, actualWidth, actualHeight);
      this.applyPlacement(calculatedOffset, placement);

      function tooltipShowComplete() {
        if (this.get('isDestroyed')) {
          return;
        }
        var prevHoverState = this.get('hoverState');

        this.get('onShown')(this);
        this.set('hoverState', null);

        if (prevHoverState === 'out') {
          this.leave();
        }
      }

      if (skipTransition === false && this.get('usesTransition')) {
        (0, _transitionEnd.default)(this.get('overlayElement'), tooltipShowComplete, this, this.get('transitionDuration'));
      } else {
        tooltipShowComplete.call(this);
      }
    },


    /**
     * Position the tooltip/popover
     *
     * @method applyPlacement
     * @param offset
     * @param placement
     * @private
     */
    applyPlacement: function applyPlacement(offset, placement) {
      var tip = this.get('overlayElement');
      var width = tip.offsetWidth;
      var height = tip.offsetHeight;

      // manually read margins because getBoundingClientRect includes difference
      var marginTop = parseInt(tip.style.marginTop, 10);
      var marginLeft = parseInt(tip.style.marginLeft, 10);

      // we must check for NaN for ie 8/9
      if (isNaN(marginTop)) {
        marginTop = 0;
      }
      if (isNaN(marginLeft)) {
        marginLeft = 0;
      }

      offset.top += marginTop;
      offset.left += marginLeft;

      (0, _setOffset.default)(tip, offset);

      this.set('showHelp', true);

      // check to see if placing tip in new offset caused the tip to resize itself
      var actualWidth = tip.offsetWidth;
      var actualHeight = tip.offsetHeight;

      if (placement === 'top' && actualHeight !== height) {
        offset.top = offset.top + height - actualHeight;
      }

      var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

      if (delta.left) {
        offset.left += delta.left;
      } else {
        offset.top += delta.top;
      }

      var isVertical = /top|bottom/.test(placement);
      var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
      var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

      (0, _setOffset.default)(tip, offset);
      this.replaceArrow(arrowDelta, tip[arrowOffsetPosition], isVertical);
    },


    /**
     * @method getViewportAdjustedDelta
     * @param placement
     * @param pos
     * @param actualWidth
     * @param actualHeight
     * @return {{top: number, left: number}}
     * @private
     */
    getViewportAdjustedDelta: function getViewportAdjustedDelta(placement, pos, actualWidth, actualHeight) {
      var delta = { top: 0, left: 0 };
      var viewport = this.get('viewportElement');
      if (!viewport) {
        return delta;
      }

      var viewportPadding = this.get('viewportPadding');
      var viewportDimensions = (0, _getPosition.default)(viewport);

      if (/right|left/.test(placement)) {
        var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
        var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
        if (topEdgeOffset < viewportDimensions.top) {
          // top overflow
          delta.top = viewportDimensions.top - topEdgeOffset;
        } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
          // bottom overflow
          delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
        }
      } else {
        var leftEdgeOffset = pos.left - viewportPadding;
        var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
        if (leftEdgeOffset < viewportDimensions.left) {
          // left overflow
          delta.left = viewportDimensions.left - leftEdgeOffset;
        } else if (rightEdgeOffset > viewportDimensions.right) {
          // right overflow
          delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
        }
      }

      return delta;
    },


    /**
     * Position the tooltip/popover's arrow
     *
     * @method replaceArrow
     * @param delta
     * @param dimension
     * @param isVertical
     * @private
     */
    replaceArrow: function replaceArrow(delta, dimension, isVertical) {
      var el = this.get('arrowElement');
      el.style[isVertical ? 'left' : 'top'] = 50 * (1 - delta / dimension) + '%';
      el.style[isVertical ? 'top' : 'left'] = null;
    },


    /**
     * Hide the tooltip/popover
     *
     * @method hide
     * @private
     */
    hide: function hide() {
      if (this.get('isDestroyed')) {
        return;
      }

      if (false === this.get('onHide')(this)) {
        return;
      }

      function tooltipHideComplete() {
        if (this.get('isDestroyed')) {
          return;
        }
        if (this.get('hoverState') !== 'in') {
          this.set('inDom', false);
        }
        this.get('onHidden')(this);
      }

      this.set('showHelp', false);

      if (this.get('usesTransition')) {
        (0, _transitionEnd.default)(this.get('overlayElement'), tooltipHideComplete, this, this.get('transitionDuration'));
      } else {
        tooltipHideComplete.call(this);
      }

      this.set('hoverState', null);
    },


    /**
     * @method addListeners
     * @private
     */
    addListeners: function addListeners() {
      var _this = this;

      var target = this.get('triggerTargetElement');

      this.get('_triggerEvents').forEach(function (event) {
        if (isArray(event)) {
          var _event = _slicedToArray(event, 2),
              inEvent = _event[0],
              outEvent = _event[1];

          _this._handleEnter = run.bind(_this, _this.enter);
          _this._handleLeave = run.bind(_this, _this.leave);
          target.addEventListener(inEvent, _this._handleEnter);
          target.addEventListener(outEvent, _this._handleLeave);
        } else {
          _this._handleToggle = run.bind(_this, _this.toggle);
          target.addEventListener(event, _this._handleToggle);
        }
      });
    },


    /**
     * @method removeListeners
     * @private
     */
    removeListeners: function removeListeners() {
      var _this2 = this;

      var target = this.get('triggerTargetElement');
      this.get('_triggerEvents').forEach(function (event) {
        if (isArray(event)) {
          var _event2 = _slicedToArray(event, 2),
              inEvent = _event2[0],
              outEvent = _event2[1];

          if (_this2._handleEnter) {
            target.removeEventListener(inEvent, _this2._handleEnter);
            _this2._handleEnter = null;
          }
          if (_this2._handleLeave) {
            target.removeEventListener(outEvent, _this2._handleLeave);
            _this2._handleLeave = null;
          }
        } else {
          if (_this2._handleToggle) {
            target.removeEventListener(event, _this2._handleToggle);
            _this2._handleToggle = null;
          }
        }
      });
    },
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.addListeners();
      if (this.get('visible')) {
        next(this, this._show, true);
      }
    },
    willRemoveElement: function willRemoveElement() {
      this._super.apply(this, arguments);
      this.removeListeners();
    },


    _watchVisible: observer('visible', function () {
      if (this.get('visible')) {
        this.show();
      } else {
        this.hide();
      }
    })

  });
});