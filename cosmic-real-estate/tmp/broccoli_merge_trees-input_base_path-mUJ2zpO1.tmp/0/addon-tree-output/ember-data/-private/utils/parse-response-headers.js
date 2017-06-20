define('ember-data/-private/utils/parse-response-headers', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = parseResponseHeaders;
  var CLRF = '\r\n';

  function parseResponseHeaders(headersString) {
    var headers = Object.create(null);

    if (!headersString) {
      return headers;
    }

    var headerPairs = headersString.split(CLRF);

    headerPairs.forEach(function (header) {
      var _header$split = header.split(':'),
          field = _header$split[0],
          value = _header$split.slice(1);

      field = field.trim();
      value = value.join(':').trim();

      if (value) {
        headers[field] = value;
      }
    });

    return headers;
  }
});