define("ember-cli-app-version/utils/regexp", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var versionRegExp = exports.versionRegExp = /\d[.]\d[.]\d/;
  var shaRegExp = exports.shaRegExp = /[a-z\d]{8}/;
});