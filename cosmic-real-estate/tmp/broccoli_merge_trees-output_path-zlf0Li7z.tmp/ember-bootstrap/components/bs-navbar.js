define('ember-bootstrap/components/bs-navbar', ['exports', 'ember-bootstrap/components/base/bs-navbar'], function (exports, _bsNavbar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsNavbar.default.extend({
    _validPositions: ['fixed-top', 'fixed-bottom', 'static-top'],

    _positionPrefix: 'navbar-'
  });
});