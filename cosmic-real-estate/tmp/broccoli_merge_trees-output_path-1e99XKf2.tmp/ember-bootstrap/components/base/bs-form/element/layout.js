define('ember-bootstrap/components/base/bs-form/element/layout', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    tagName: '',

    /**
     * @property formElementId
     * @type {String}
     * @public
     */
    formElementId: null,

    /**
     * @property hasLabel
     * @type boolean
     * @public
     */
    hasLabel: true,

    /**
     * @property errorsComponent
     * @type {Ember.Component}
     * @public
     */
    errorsComponent: null,

    /**
     * @property feedbackIconComponent
     * @type {Ember.Component}
     * @public
     */
    feedbackIconComponent: null,

    /**
     * @property labelComponent
     * @type {Ember.Component}
     * @public
     */
    labelComponent: null,

    /**
     * @property helpTextComponent
     * @type {Ember.Component}
     * @public
     */
    helpTextComponent: null
  });
});