define("ember-data/-private/transforms", ["exports", "ember-data/transform", "ember-data/-private/transforms/number", "ember-data/-private/transforms/date", "ember-data/-private/transforms/string", "ember-data/-private/transforms/boolean"], function (exports, _transform, _number, _date, _string, _boolean) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BooleanTransform = exports.StringTransform = exports.DateTransform = exports.NumberTransform = exports.Transform = undefined;
  exports.Transform = _transform.default;
  exports.NumberTransform = _number.default;
  exports.DateTransform = _date.default;
  exports.StringTransform = _string.default;
  exports.BooleanTransform = _boolean.default;
});