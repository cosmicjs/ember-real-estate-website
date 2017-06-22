define('ember-bootstrap/components/base/bs-navbar/toggle', ['exports', 'ember-bootstrap/components/bs-button', 'ember-bootstrap/templates/components/bs-navbar/toggle'], function (exports, _bsButton, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _bsButton.default.extend({
    layout: _toggle.default,

    classNameBindings: ['collapsed'],
    collapsed: true

    /**
     * Bootstrap 4 Only: Defines the alignment of the toggler. Valid values are 'left' and 'right'
     * to set the `navbar-toggler-*` class.
     *
     * @property align
     * @type String
     * @default null
     * @public
     */

  });
});