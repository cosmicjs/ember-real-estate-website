define('ember-bootstrap/components/base/bs-form/group', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-form/group', 'ember-bootstrap/config', 'ember-bootstrap/mixins/size-class'], function (exports, _ember, _group, _config, _sizeClass) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _ember.default.Component.extend(_sizeClass.default, {
    layout: _group.default,

    classNames: ['form-group'],
    classNameBindings: ['validationClass'],

    /**
     * @property classTypePrefix
     * @type String
     * @default 'form-group' (BS3) or 'form-control' (BS4)
     * @private
     */

    /**
     * Whether to show validation state icons.
     * See http://getbootstrap.com/css/#forms-control-validation
     *
     * @property useIcons
     * @type boolean
     * @default true
     * @public
     */
    useIcons: true,

    /**
     * Computed property which is true if the form group is in a validation state
     *
     * @property hasValidation
     * @type boolean
     * @private
     * @readonly
     */
    hasValidation: computed.notEmpty('validation').readOnly(),

    /**
     * Computed property which is true if the form group is showing a validation icon
     *
     * @property hasFeedback
     * @type boolean
     * @private
     * @readonly
     */
    hasFeedback: computed.and('hasValidation', 'useIcons', 'hasIconForValidationState').readOnly(),

    /**
     * The icon classes to be used for a feedback icon in a "success" validation state.
     * Defaults to the usual glyphicon classes. This is ignored, and no feedback icon is
     * rendered if `useIcons` is false.
     *
     * You can change this globally by setting the `formValidationSuccessIcon` property of
     * the ember-bootstrap configuration in your config/environment.js file. If your are
     * using FontAwesome for example:
     *
     * ```js
     * ENV['ember-bootstrap'] = {
       *   formValidationSuccessIcon: 'fa fa-check'
       * }
     * ```
     *
     * @property successIcon
     * @type string
     * @default 'glyphicon glyphicon-ok'
     * @public
     */
    successIcon: _config.default.formValidationSuccessIcon,

    /**
     * The icon classes to be used for a feedback icon in a "error" validation state.
     * Defaults to the usual glyphicon classes. This is ignored, and no feedback icon is
     * rendered if `useIcons` is false.
     *
     * You can change this globally by setting the `formValidationErrorIcon` property of
     * the ember-bootstrap configuration in your config/environment.js file. If your are
     * using FontAwesome for example:
     *
     * ```js
     * ENV['ember-bootstrap'] = {
       *   formValidationErrorIcon: 'fa fa-times'
       * }
     * ```
     *
     * @property errorIcon
     * @type string
     * @public
     */
    errorIcon: _config.default.formValidationErrorIcon,

    /**
     * The icon classes to be used for a feedback icon in a "warning" validation state.
     * Defaults to the usual glyphicon classes. This is ignored, and no feedback icon is
     * rendered if `useIcons` is false.
     *
     * You can change this globally by setting the `formValidationWarningIcon` property of
     * the ember-bootstrap configuration in your config/environment.js file. If your are
     * using FontAwesome for example:
     *
     * ```js
     * ENV['ember-bootstrap'] = {
       *   formValidationWarningIcon: 'fa fa-warning'
       * }
     * ```
     *
     * @property warningIcon
     * @type string
     * @public
     */
    warningIcon: _config.default.formValidationWarningIcon,

    /**
     * The icon classes to be used for a feedback icon in a "info" validation state.
     * Defaults to the usual glyphicon classes. This is ignored, and no feedback icon is
     * rendered if `useIcons` is false.
     *
     * You can change this globally by setting the `formValidationInfoIcon` property of
     * the ember-bootstrap configuration in your config/environment.js file. If your are
     * using FontAwesome for example:
     *
     * ```js
     * ENV['ember-bootstrap'] = {
       *   formValidationInfoIcon: 'fa fa-info-circle
       * }
     * ```
     *
     * The "info" validation state is not supported in Bootstrap CSS, but can be easily added
     * using the following LESS style:
     * ```less
     * .has-info {
       *   .form-control-validation(@state-info-text; @state-info-text; @state-info-bg);
       * }
     * ```
     *
     * @property infoIcon
     * @type string
     * @public
     */
    infoIcon: _config.default.formValidationInfoIcon,

    /**
     * @property iconName
     * @type string
     * @readonly
     * @private
     */
    iconName: computed('validation', function () {
      var validation = this.get('validation') || 'success';
      return this.get(validation + 'Icon');
    }).readOnly(),

    /**
     * @property hasIconForValidationState
     * @type boolean
     * @readonly
     * @private
     */
    hasIconForValidationState: computed.notEmpty('iconName').readOnly(),

    /**
     * Set to a validation state to render the form-group with a validation style.
     * See http://getbootstrap.com/css/#forms-control-validation
     *
     * The default states of "success", "warning" and "error" are supported by Bootstrap out-of-the-box.
     * But you can use custom states as well. This will set a has-<state> class, and (if `useIcons`is true)
     * a feedback whose class is taken from the <state>Icon property
     *
     * Note that BS4 uses the `has-danger` class for the `error` validation state and does not automatically
     * import glyphicons.
     *
     * @property validation
     * @type string
     * @public
     */
    validation: null,

    /**
     * @property validationClass
     * @type string
     * @readonly
     * @private
     */
    validationClass: computed('_validationType', function () {
      var validation = this.get('_validationType');
      if (!_ember.default.isBlank(validation)) {
        return 'has-' + this.get('_validationType');
      }
    }).readOnly()
  });
});