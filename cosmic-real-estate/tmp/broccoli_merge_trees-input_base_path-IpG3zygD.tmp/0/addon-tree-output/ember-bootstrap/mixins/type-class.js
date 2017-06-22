define('ember-bootstrap/mixins/type-class', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Mixin.create({
    /**
     * Prefix for the type class, e.g. "btn" for button type classes ("btn-primary2 etc.)
     *
     * @property classTypePrefix
     * @type string
     * @required
     * @protected
     */
    classTypePrefix: null,

    classNameBindings: ['typeClass'],

    typeClass: _ember.default.computed('type', function () {
      var prefix = this.get('classTypePrefix');
      var type = this.get('type') || 'default';
      return prefix + '-' + type;
    }),

    /**
     * Property for type styling
     *
     * For the available types see the [Bootstrap docs](http://getbootstrap.com/css/#buttons-options) (use without "btn-" prefix)
     *
     * @property type
     * @type String
     * @default 'default'
     * @public
     */
    type: 'default'
  });
});