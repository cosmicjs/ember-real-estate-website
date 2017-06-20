define('ember-bootstrap/helpers/bs-eq', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.eq = eq;
  function eq(params) {
    return params[0] === params[1];
  }

  exports.default = _ember.default.Helper.helper(eq);
});