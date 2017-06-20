define('ember-bootstrap/components/base/bs-modal/body', ['exports', 'ember', 'ember-bootstrap/templates/components/bs-modal/body'], function (exports, _ember, _body) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    layout: _body.default,
    classNames: ['modal-body']
  });
});