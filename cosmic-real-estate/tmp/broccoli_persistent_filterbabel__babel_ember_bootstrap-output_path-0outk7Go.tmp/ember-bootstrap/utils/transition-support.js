define('ember-bootstrap/utils/transition-support', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function transitionSupport() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }

    return false;
  }

  exports.default = typeof document !== 'undefined' && transitionSupport();
});