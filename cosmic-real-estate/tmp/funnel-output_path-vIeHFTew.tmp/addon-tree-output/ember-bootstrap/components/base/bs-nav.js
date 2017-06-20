define('ember-bootstrap/components/base/bs-nav', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-nav'], function (exports, _ember, _bsNav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isPresent = _ember.default.isPresent;
  exports.default = _ember.default.Component.extend({
    layout: _bsNav.default,

    tagName: 'ul',
    classNames: ['nav'],

    classNameBindings: ['typeClass', 'justified:nav-justified'],

    typeClass: _ember.default.computed('type', function () {
      var type = this.get('type');
      if (isPresent(type)) {
        return 'nav-' + type;
      }
    }),

    /**
     * Special type of nav, either "pills" or "tabs"
     *
     * @property type
     * @type String
     * @default null
     * @public
     */
    type: null,

    /**
     * Make the nav justified, see [bootstrap docs](http://getbootstrap.com/components/#nav-justified)
     *
     * @property justified
     * @type boolean
     * @default false
     * @public
     */
    justified: false,

    /**
     * Make the nav pills stacked, see [bootstrap docs](http://getbootstrap.com/components/#nav-pills)
     *
     * @property stacked
     * @type boolean
     * @default false
     * @public
     */
    stacked: false
  });
});