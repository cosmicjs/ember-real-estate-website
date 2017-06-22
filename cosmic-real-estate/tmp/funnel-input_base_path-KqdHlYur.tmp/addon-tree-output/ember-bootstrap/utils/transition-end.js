define('ember-bootstrap/utils/transition-end', ['exports', 'ember', 'ember-bootstrap/utils/transition-support'], function (exports, _ember, _transitionSupport) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = onTransitionEnd;
  var _Ember$run = _ember.default.run,
      join = _Ember$run.join,
      cancel = _Ember$run.cancel,
      later = _Ember$run.later;
  function onTransitionEnd(node, handler, context) {
    var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (!node) {
      return;
    }
    var fakeEvent = {
      target: node,
      currentTarget: node
    };
    var backup = void 0;

    if (_transitionSupport.default) {
      node.addEventListener(_transitionSupport.default, done, false);

      backup = later(this, done, fakeEvent, duration);
    } else {
      later(this, done, fakeEvent, 0);
    }

    function done(event) {
      if (backup) {
        cancel(backup);
      }
      event.target.removeEventListener(_transitionSupport.default, done);
      join(context, handler, event);
    }
  }
});