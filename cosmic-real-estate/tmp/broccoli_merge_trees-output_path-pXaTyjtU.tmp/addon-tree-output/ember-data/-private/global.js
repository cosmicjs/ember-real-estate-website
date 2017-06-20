define('ember-data/-private/global', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /* globals global, window, self */

  // originally from https://github.com/emberjs/ember.js/blob/c0bd26639f50efd6a03ee5b87035fd200e313b8e/packages/ember-environment/lib/global.js

  // from lodash to catch fake globals
  function checkGlobal(value) {
    return value && value.Object === Object ? value : undefined;
  }

  // element ids can ruin global miss checks
  function checkElementIdShadowing(value) {
    return value && value.nodeType === undefined ? value : undefined;
  }

  // export real global
  exports.default = checkGlobal(checkElementIdShadowing((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global)) || checkGlobal((typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self) || checkGlobal((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window) || new Function('return this')();
});