define("ember-inflector/index", ["module", "exports", "ember", "ember-inflector/lib/system", "ember-inflector/lib/ext/string"], function (module, exports, _ember, _system) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.defaultRules = exports.singularize = exports.pluralize = undefined;
  /* global define, module */

  _system.Inflector.defaultRules = _system.defaultRules;
  _ember.default.Inflector = _system.Inflector;

  _ember.default.String.pluralize = _system.pluralize;
  _ember.default.String.singularize = _system.singularize;

  exports.default = _system.Inflector;
  exports.pluralize = _system.pluralize;
  exports.singularize = _system.singularize;
  exports.defaultRules = _system.defaultRules;


  if (typeof define !== 'undefined' && define.amd) {
    define('ember-inflector', ['exports'], function (__exports__) {
      __exports__['default'] = _system.Inflector;
      __exports__.pluralize = _system.pluralize;
      __exports__.singularize = _system.singularize;

      return __exports__;
    });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = _system.Inflector;
    _system.Inflector.singularize = _system.singularize;
    _system.Inflector.pluralize = _system.pluralize;
  }
});