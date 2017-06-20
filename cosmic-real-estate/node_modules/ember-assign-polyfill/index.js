/* jshint node: true */
'use strict';

var VersionChecker = require('ember-cli-version-checker');
var hasBeenWarned = false;

module.exports = {
  name: 'ember-assign-polyfill',
  included: function() {
    this._ensureThisImport();

    var checker = new VersionChecker(this);
    var emberVersion = checker.forEmber();

    if (emberVersion.lt('2.5.0')) {
      this.import('vendor/ember-assign-polyfill/index.js');
    } else if (this.parent === this.project && !hasBeenWarned){
      console.warn('ember-assign-polyfill is not required for Ember 2.5.0 and later, please remove from your `package.json`.');
      hasBeenWarned = true;
    }
  },

  _ensureThisImport: function() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        var current = this;
        var app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
      this.import = function importShim(asset, options) {
        var app = this._findHost();
        app.import(asset, options);
      };
    }
  }
};
