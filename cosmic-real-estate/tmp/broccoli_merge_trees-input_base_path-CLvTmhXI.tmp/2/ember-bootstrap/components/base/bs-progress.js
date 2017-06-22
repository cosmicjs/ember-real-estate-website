define('ember-bootstrap/components/base/bs-progress', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-progress'], function (exports, _ember, _bsProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _bsProgress.default,
    classNames: ['progress']
  });
});