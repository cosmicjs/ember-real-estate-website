define('ember-inflector/lib/utils/make-helper', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = makeHelper;
  function makeHelper(helperFunction) {
    if (_ember.default.Helper) {
      return _ember.default.Helper.helper(helperFunction);
    }
    if (_ember.default.HTMLBars) {
      return _ember.default.HTMLBars.makeBoundHelper(helperFunction);
    }
    return _ember.default.Handlebars.makeBoundHelper(helperFunction);
  }
});