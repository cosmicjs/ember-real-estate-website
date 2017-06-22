define("ember-data/-private/adapters", ["exports", "ember-data/adapters/json-api", "ember-data/adapters/rest"], function (exports, _jsonApi, _rest) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RESTAdapter = exports.JSONAPIAdapter = undefined;
  exports.JSONAPIAdapter = _jsonApi.default;
  exports.RESTAdapter = _rest.default;
});