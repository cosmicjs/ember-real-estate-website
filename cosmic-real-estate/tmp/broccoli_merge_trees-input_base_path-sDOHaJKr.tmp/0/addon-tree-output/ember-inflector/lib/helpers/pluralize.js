define('ember-inflector/lib/helpers/pluralize', ['exports', 'ember-inflector', 'ember-inflector/lib/utils/make-helper'], function (exports, _emberInflector, _makeHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _makeHelper.default)(function (params, hash) {
    var count = void 0,
        word = void 0,
        withoutCount = false;

    if (params.length === 1) {
      word = params[0];
      return (0, _emberInflector.pluralize)(word);
    } else {
      count = params[0];
      word = params[1];

      if (hash["without-count"]) {
        withoutCount = hash["without-count"];
      }

      if (parseFloat(count) !== 1) {
        word = (0, _emberInflector.pluralize)(word);
      }

      return withoutCount ? word : count + " " + word;
    }
  });
});