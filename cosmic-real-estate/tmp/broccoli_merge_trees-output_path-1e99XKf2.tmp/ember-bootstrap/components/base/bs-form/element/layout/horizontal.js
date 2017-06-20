define('ember-bootstrap/components/base/bs-form/element/layout/horizontal', ['exports', 'ember', 'ember-bootstrap/components/base/bs-form/element/layout', 'ember-bootstrap/templates/components/bs-form/element/layout/horizontal'], function (exports, _ember, _layout, _horizontal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var assert = _ember.default.assert,
      computed = _ember.default.computed,
      isBlank = _ember.default.isBlank;
  exports.default = _layout.default.extend({
    layout: _horizontal.default,

    /**
     * The Bootstrap grid class for form labels within a horizontal layout form.
     *
     * @property horizontalLabelGridClass
     * @type string
     * @public
     */
    horizontalLabelGridClass: null,

    /**
     * Computed property that specifies the Bootstrap grid class for form controls within a horizontal layout form.
     *
     * @property horizontalInputGridClass
     * @type string
     * @readonly
     * @private
     */
    horizontalInputGridClass: computed('horizontalLabelGridClass', function () {
      if (isBlank(this.get('horizontalLabelGridClass'))) {
        return;
      }
      var parts = this.get('horizontalLabelGridClass').split('-');
      assert('horizontalInputGridClass must match format bootstrap grid column class', parts.length === 3);
      parts[2] = 12 - parts[2];
      return parts.join('-');
    }).readOnly(),

    /**
     * Computed property that specifies the Bootstrap offset grid class for form controls within a horizontal layout
     * form, that have no label.
     *
     * @property horizontalInputOffsetGridClass
     * @type string
     * @readonly
     * @private
     */
    horizontalInputOffsetGridClass: computed('horizontalLabelGridClass', function () {
      if (isBlank(this.get('horizontalLabelGridClass'))) {
        return;
      }
      var parts = this.get('horizontalLabelGridClass').split('-');
      parts.splice(2, 0, 'offset');
      return parts.join('-');
    })

  });
});