define('ember-ajax/ajax-request', ['exports', 'ember', 'ember-ajax/mixins/ajax-request'], function (exports, _ember, _ajaxRequest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberObject = _ember.default.Object;
  exports.default = EmberObject.extend(_ajaxRequest.default);
});