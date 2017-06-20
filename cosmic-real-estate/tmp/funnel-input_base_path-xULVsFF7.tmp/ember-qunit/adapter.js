define('ember-qunit/adapter', ['exports', 'ember', 'qunit'], function (exports, _ember, _qunit) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Test.Adapter.extend({
    init: function init() {
      this.doneCallbacks = [];
    },
    asyncStart: function asyncStart() {
      this.doneCallbacks.push(_qunit.default.config.current ? _qunit.default.config.current.assert.async() : null);
    },
    asyncEnd: function asyncEnd() {
      var done = this.doneCallbacks.pop();
      // This can be null if asyncStart() was called outside of a test
      if (done) {
        done();
      }
    },
    exception: function exception(error) {
      _qunit.default.config.current.assert.ok(false, _ember.default.inspect(error));
    }
  });
});