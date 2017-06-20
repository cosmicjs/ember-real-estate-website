define('ember-bootstrap/utils/get-parent', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getParent;
  var get = _ember.default.get;
  function getParent(view) {
    if (get(view, 'tagName') === '') {
      // Beware: use of private API! :(
      if (_ember.default.ViewUtils && _ember.default.ViewUtils.getViewBounds) {
        return _ember.default.ViewUtils.getViewBounds(view).parentElement;
      } else {
        return view._renderNode.contextualElement;
      }
    } else {
      return get(view, 'element').parentNode;
    }
  }
});