define('ember-data/-private/system/normalize-link', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _normalizeLink;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /*
    This method normalizes a link to an "links object". If the passed link is
    already an object it's returned without any modifications.
  
    See http://jsonapi.org/format/#document-links for more information.
  
    @method _normalizeLink
    @private
    @param {String} link
    @return {Object|null}
    @for DS
  */
  function _normalizeLink(link) {
    switch (typeof link === 'undefined' ? 'undefined' : _typeof(link)) {
      case 'object':
        return link;
      case 'string':
        return { href: link };
    }
    return null;
  }
});