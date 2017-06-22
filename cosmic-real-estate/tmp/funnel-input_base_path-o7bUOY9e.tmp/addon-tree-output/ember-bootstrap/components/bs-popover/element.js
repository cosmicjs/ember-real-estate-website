define('ember-bootstrap/components/bs-popover/element', ['exports', 'ember-bootstrap/components/base/bs-popover/element'], function (exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _element.default.extend({
    classNameBindings: ['placement', 'showHelp:in']
  });
});