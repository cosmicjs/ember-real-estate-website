define('ember-bootstrap/components/base/bs-accordion/item', ['exports', 'ember', 'ember-bootstrap/mixins/type-class', 'ember-bootstrap/mixins/component-child', 'ember-bootstrap/templates/components/bs-accordion/item'], function (exports, _ember, _typeClass, _componentChild, _item) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _ember.default.Component.extend(_componentChild.default, _typeClass.default, {
    layout: _item.default,

    /**
     * The title of the accordion item, displayed as a .panel-title element
     *
     * @property title
     * @type string
     * @public
     */
    title: null,

    /**
     * The value of the accordion item, which is used as the value of the `selected` property of the parent [Components.Accordion](Components.Accordion.html) component
     *
     * @property value
     * @public
     */
    value: computed.oneWay('elementId'),

    /**
     * @property selected
     * @private
     */
    selected: null,

    /**
     * @property collapsed
     * @type boolean
     * @readonly
     * @private
     */
    collapsed: computed('value', 'selected', function () {
      return this.get('value') !== this.get('selected');
    }).readOnly(),

    /**
     * @property active
     * @type boolean
     * @readonly
     * @private
     */
    active: computed.not('collapsed'),

    /**
     * Reference to the parent `Components.Accordion` class.
     *
     * @property accordion
     * @private
     */
    accordion: null,

    /**
     * @event onClick
     * @public
     */
    onClick: function onClick() {}
  });
});