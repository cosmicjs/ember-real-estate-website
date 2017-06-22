define("ember-bootstrap/utils/set-offset", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = setOffset;
  // simplified version of jQuery.offset.setOffset
  function setOffset(elem, options) {
    var curOffset = getOffset(elem);
    var curCSSTop = elem.style.top;
    var curCSSLeft = elem.style.left;

    var curTop = parseFloat(curCSSTop) || 0;
    var curLeft = parseFloat(curCSSLeft) || 0;

    if (options.top != null) {
      elem.style.top = Math.round(options.top - curOffset.top + curTop) + "px";
    }
    if (options.left != null) {
      elem.style.left = Math.round(options.left - curOffset.left + curLeft) + "px";
    }
  }

  function getOffset(elem) {
    var rect = elem.getBoundingClientRect();
    var win = elem.ownerDocument.defaultView;
    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    };
  }
});