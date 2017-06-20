define("ember-data/-private/serializers", ["exports", "ember-data/serializers/json-api", "ember-data/serializers/json", "ember-data/serializers/rest"], function (exports, _jsonApi, _json, _rest) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RESTSerializer = exports.JSONSerializer = exports.JSONAPISerializer = undefined;
  exports.JSONAPISerializer = _jsonApi.default;
  exports.JSONSerializer = _json.default;
  exports.RESTSerializer = _rest.default;
});