define('ember-bootstrap/config', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Config = _ember.default.Object.extend();

  Config.reopenClass({
    formValidationSuccessIcon: 'glyphicon glyphicon-ok',
    formValidationErrorIcon: 'glyphicon glyphicon-remove',
    formValidationWarningIcon: 'glyphicon glyphicon-warning-sign',
    formValidationInfoIcon: 'glyphicon glyphicon-info-sign',
    insertEmberWormholeElementToDom: true,

    load: function load() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var property in config) {
        if (this.hasOwnProperty(property) && typeof this[property] !== 'function') {
          this[property] = config[property];
        }
      }
    }
  });

  exports.default = Config;
});