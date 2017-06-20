define("ember-test-helpers/test-context", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setContext = setContext;
  exports.getContext = getContext;
  exports.unsetContext = unsetContext;
  var __test_context__;

  function setContext(context) {
    __test_context__ = context;
  }

  function getContext() {
    return __test_context__;
  }

  function unsetContext() {
    __test_context__ = undefined;
  }
});