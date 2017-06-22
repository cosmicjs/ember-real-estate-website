define('ember-bootstrap/mixins/component-parent', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Mixin.create({

    /**
     * Array of registered child components
     *
     * @property children
     * @type array
     * @protected
     */
    children: null,

    init: function init() {
      this._super.apply(this, arguments);
      this.set('children', _ember.default.A());
    },


    /**
     * Register a component as a child of this parent
     *
     * @method registerChild
     * @param child
     * @public
     */
    registerChild: function registerChild(child) {
      _ember.default.run.schedule('sync', this, function () {
        this.get('children').addObject(child);
      });
    },


    /**
     * Remove the child component from this parent component
     *
     * @method removeChild
     * @param child
     * @public
     */
    removeChild: function removeChild(child) {
      this.get('children').removeObject(child);
    }
  });
});