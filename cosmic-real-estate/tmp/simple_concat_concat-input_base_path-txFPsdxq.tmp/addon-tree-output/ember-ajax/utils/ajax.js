define('ember-ajax/utils/ajax', ['exports', 'ember', 'ember-ajax/-private/utils/is-fastboot'], function (exports, _ember, _isFastboot) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = _ember.default.$;
  exports.default = _isFastboot.default ? najax : $.ajax;
});