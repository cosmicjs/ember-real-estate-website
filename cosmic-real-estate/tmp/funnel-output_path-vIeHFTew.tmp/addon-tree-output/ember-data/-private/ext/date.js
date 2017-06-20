define('ember-data/-private/ext/date', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.parseDate = undefined;


  /**
     Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
  
     © 2011 Colin Snover <http://zetafleet.com>
  
     Released under MIT license.
  
     @class Date
     @namespace Ember
     @static
     @deprecated
  */
  /**
    @module ember-data
  */

  _ember.default.Date = _ember.default.Date || {};

  var origParse = Date.parse;
  var numericKeys = [1, 4, 5, 6, 7, 10, 11];

  var parseDate = exports.parseDate = function parseDate(date) {
    var timestamp = void 0,
        struct = void 0;
    var minutesOffset = 0;

    // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
    // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
    // implementations could be faster
    //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
    if (struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2}):?(?:(\d{2}))?)?)?$/.exec(date)) {
      // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
      for (var i = 0, k; k = numericKeys[i]; ++i) {
        struct[k] = +struct[k] || 0;
      }

      // allow undefined days and months
      struct[2] = (+struct[2] || 1) - 1;
      struct[3] = +struct[3] || 1;

      if (struct[8] !== 'Z' && struct[9] !== undefined) {
        minutesOffset = struct[10] * 60 + struct[11];

        if (struct[9] === '+') {
          minutesOffset = 0 - minutesOffset;
        }
      }

      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    } else {
      timestamp = origParse ? origParse(date) : NaN;
    }

    return timestamp;
  };

  _ember.default.Date.parse = function (date) {
    // throw deprecation
    (0, _debug.deprecate)('Ember.Date.parse is deprecated because Safari 5-, IE8-, and\n      Firefox 3.6- are no longer supported (see\n      https://github.com/csnover/js-iso8601 for the history of this issue).\n      Please use Date.parse instead', false, {
      id: 'ds.ember.date.parse-deprecate',
      until: '3.0.0'
    });

    return parseDate(date);
  };

  if (_ember.default.EXTEND_PROTOTYPES === true || _ember.default.EXTEND_PROTOTYPES.Date) {
    (0, _debug.deprecate)('Overriding Date.parse with Ember.Date.parse is deprecated. Please set ENV.EmberENV.EXTEND_PROTOTYPES.Date to false in config/environment.js\n\n\n// config/environment.js\nENV = {\n  EmberENV: {\n    EXTEND_PROTOTYPES: {\n      Date: false,\n    }\n  }\n}\n', false, {
      id: 'ds.date.parse-deprecate',
      until: '3.0.0'
    });
    Date.parse = parseDate;
  }
});