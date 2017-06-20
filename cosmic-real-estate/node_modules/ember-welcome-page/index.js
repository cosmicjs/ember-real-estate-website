/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-welcome-page',

  included: function(app) {
    this._super.included(app);

    if (this._isProduction()) { return; }

    app.import('vendor/welcome-page.css');
  },

  treeForPublic: function() {
    if (this._isProduction()) { return false; }

    var tree = this._super.treeForPublic.apply(this, arguments);

    return tree;
  },

  treeForAddon: function() {
    if (this._isProduction()) { return false; }

    var tree = this._super.treeForAddon.apply(this, arguments);

    return tree;
  },

  treeForApp: function() {
    if (this._isProduction()) { return false; }

    var tree = this._super.treeForApp.apply(this, arguments);

    return tree;
  },

  _isProduction: function() {
    return process.env.EMBER_ENV === 'production';
  }
};
