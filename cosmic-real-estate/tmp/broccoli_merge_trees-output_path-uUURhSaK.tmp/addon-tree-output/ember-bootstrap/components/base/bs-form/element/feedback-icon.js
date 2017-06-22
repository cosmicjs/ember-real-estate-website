define('ember-bootstrap/components/base/bs-form/element/feedback-icon', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-form/element/feedback-icon'], function (exports, _ember, _feedbackIcon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _feedbackIcon.default,
    tagName: '',

    /**
     * @property show
     * @type {Boolean}
     * @public
     */
    show: false,

    /**
     * @property iconName
     * @type {String}
     * @public
     */
    iconName: null
  });
});