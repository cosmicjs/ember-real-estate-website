define('ember-bootstrap/components/base/bs-form', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-form'], function (exports, _ember, _bsForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed,
      RSVP = _ember.default.RSVP,
      set = _ember.default.set,
      assert = _ember.default.assert,
      isPresent = _ember.default.isPresent;
  exports.default = _ember.default.Component.extend({
    layout: _bsForm.default,
    tagName: 'form',
    classNameBindings: ['layoutClass'],
    attributeBindings: ['_novalidate:novalidate'],
    ariaRole: 'form',

    /**
     * Bootstrap form class name (computed)
     *
     * @property layoutClass
     * @type string
     * @readonly
     * @protected
     *
     */

    /**
     * Set a model that this form should represent. This serves several purposes:
     *
     * * child `Components.FormElement`s can access and bind to this model by their `property`
     * * when the model supports validation by using the [ember-validations](https://github.com/dockyard/ember-validations) mixin,
     * child `Components.FormElement`s will look at the validation information of their `property` and render their form group accordingly.
     * Moreover the form's `submit` event handler will validate the model and deny submitting if the model is not validated successfully.
     *
     * @property model
     * @type Ember.Object
     * @public
     */
    model: null,

    /**
     * Set the layout of the form to either "vertical", "horizontal" or "inline". See http://getbootstrap.com/css/#forms-inline and http://getbootstrap.com/css/#forms-horizontal
     *
     * @property formLayout
     * @type string
     * @public
     */
    formLayout: 'vertical',

    /**
     * Check if validating the model is supported. This needs to be implemented by another addon.
     *
     * @property hasValidator
     * @type boolean
     * @readonly
     * @protected
     */
    hasValidator: false,

    /**
     * The Bootstrap grid class for form labels. This is used by the `Components.FormElement` class as a default for the
     * whole form.
     *
     * @property horizontalLabelGridClass
     * @type string
     * @default 'col-md-4'
     * @public
     */
    horizontalLabelGridClass: 'col-md-4',

    /**
     * If set to true pressing enter will submit the form, even if no submit button is present
     *
     * @property submitOnEnter
     * @type boolean
     * @default false
     * @public
     */
    submitOnEnter: false,

    /**
     * If set to true novalidate attribute is present on form element
     *
     * @property novalidate
     * @type boolean
     * @default null
     * @public
     */
    novalidate: false,

    _novalidate: computed('novalidate', function () {
      return this.get('novalidate') === true ? '' : undefined;
    }),

    /**
     * Validate hook which will return a promise that will either resolve if the model is valid
     * or reject if it's not. This should be overridden to add validation support.
     *
     * @method validate
     * @param {Object} model
     * @return {Promise}
     * @public
     */
    validate: function validate(model) {},
    // eslint-disable-line no-unused-vars

    /**
     * @property showAllValidations
     * @type boolean
     * @default false
     * @private
     */
    showAllValidations: false,

    /**
     * Action is called before the form is validated (if possible) and submitted.
     *
     * @event onBefore
     * @param { Object } model  The form's `model`
     * @public
     */
    onBefore: function onBefore(model) {},
    // eslint-disable-line no-unused-vars

    /**
     * Action is called when submit has been triggered and the model has passed all validations (if present).
     *
     * @event onSubmit
     * @param { Object } model  The form's `model`
     * @param { Object } result The returned result from the validate method, if validation is available
     * @public
     */
    onSubmit: function onSubmit(model, result) {},
    // eslint-disable-line no-unused-vars

    /**
     * Action is called when validation of the model has failed.
     *
     * @event onInvalid
     * @param { Object } error
     * @public
     */
    onInvalid: function onInvalid(error) {},
    // eslint-disable-line no-unused-vars

    /**
     * Submit handler that will send the default action ("action") to the controller when submitting the form.
     *
     * If there is a supplied `model` that supports validation (`hasValidator`) the model will be validated before, and
     * only if validation is successful the default action will be sent. Otherwise an "invalid" action will be sent, and
     * all the `showValidation` property of all child `Components.FormElement`s will be set to true, so error state and
     * messages will be shown automatically.
     *
     * @method submit
     * @private
     */
    submit: function submit(e) {
      var _this = this;

      if (e) {
        e.preventDefault();
      }
      var model = this.get('model');

      this.get('onBefore')(model);

      if (!this.get('hasValidator')) {
        return this.get('onSubmit')(model);
      } else {
        var validationPromise = this.validate(this.get('model'));
        if (validationPromise && validationPromise instanceof RSVP.Promise) {
          validationPromise.then(function (r) {
            return _this.get('onSubmit')(model, r);
          }).catch(function (err) {
            _this.set('showAllValidations', true);
            return _this.get('onInvalid')(model, err);
          });
        }
      }
    },
    keyPress: function keyPress(e) {
      var code = e.keyCode || e.which;
      if (code === 13 && this.get('submitOnEnter')) {
        this.triggerSubmit();
      }
    },
    triggerSubmit: function triggerSubmit() {
      var event = document.createEvent('Event');
      event.initEvent('submit', true, true);
      this.get('element').dispatchEvent(event);
    },


    actions: {
      change: function change(value, model, property) {
        assert('You cannot use the form element\'s default onChange action for form elements if not using a model or setting the value directly on a form element. You must add your own onChange action to the form element in this case!', isPresent(model) && isPresent(property));
        set(model, property, value);
      }
    }
  });
});