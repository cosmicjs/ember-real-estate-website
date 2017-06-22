define('ember-ajax/services/ajax', ['exports', 'ember', 'ember-ajax/mixins/ajax-request'], function (exports, _ember, _ajaxRequest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = _ember.default.Service;
  exports.default = Service.extend(_ajaxRequest.default);
});