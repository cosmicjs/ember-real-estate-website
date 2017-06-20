define("ember-data/-private/system/model", ["exports", "ember-data/-private/system/model/model", "ember-data/attr", "ember-data/-private/system/model/states", "ember-data/-private/system/model/errors"], function (exports, _model, _attr, _states, _errors) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Errors = exports.attr = exports.RootState = undefined;
  exports.RootState = _states.default;
  exports.attr = _attr.default;
  exports.Errors = _errors.default;
  exports.default = _model.default;
});