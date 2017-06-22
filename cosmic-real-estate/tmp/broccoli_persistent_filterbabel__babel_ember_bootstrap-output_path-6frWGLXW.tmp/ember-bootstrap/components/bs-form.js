define('ember-bootstrap/components/bs-form', ['exports', 'ember', 'ember-bootstrap/components/base/bs-form'], function (exports, _ember, _bsForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = _ember.default.computed;
  exports.default = _bsForm.default.extend({
    layoutClass: computed('formLayout', function () {
      var layout = this.get('formLayout');
      return layout === 'vertical' ? 'form' : 'form-' + layout;
    }).readOnly()
  });
});