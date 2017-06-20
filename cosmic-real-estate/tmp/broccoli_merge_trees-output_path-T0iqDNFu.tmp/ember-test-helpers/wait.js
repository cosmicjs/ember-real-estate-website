define('ember-test-helpers/wait', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._teardownAJAXHooks = _teardownAJAXHooks;
  exports._setupAJAXHooks = _setupAJAXHooks;
  exports.default = wait;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var jQuery = _ember.default.$;

  var requests;
  function incrementAjaxPendingRequests(_, xhr) {
    requests.push(xhr);
  }

  function decrementAjaxPendingRequests(_, xhr) {
    for (var i = 0; i < requests.length; i++) {
      if (xhr === requests[i]) {
        requests.splice(i, 1);
      }
    }
  }

  function _teardownAJAXHooks() {
    if (!jQuery) {
      return;
    }

    jQuery(document).off('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).off('ajaxComplete', decrementAjaxPendingRequests);
  }

  function _setupAJAXHooks() {
    requests = [];

    if (!jQuery) {
      return;
    }

    jQuery(document).on('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).on('ajaxComplete', decrementAjaxPendingRequests);
  }

  var _internalCheckWaiters;
  if (_ember.default.__loader.registry['ember-testing/test/waiters']) {
    _internalCheckWaiters = _ember.default.__loader.require('ember-testing/test/waiters').checkWaiters;
  }

  function checkWaiters() {
    if (_internalCheckWaiters) {
      return _internalCheckWaiters();
    } else if (_ember.default.Test.waiters) {
      if (_ember.default.Test.waiters.any(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            context = _ref2[0],
            callback = _ref2[1];

        return !callback.call(context);
      })) {
        return true;
      }
    }

    return false;
  }

  function wait(_options) {
    var options = _options || {};
    var waitForTimers = options.hasOwnProperty('waitForTimers') ? options.waitForTimers : true;
    var waitForAJAX = options.hasOwnProperty('waitForAJAX') ? options.waitForAJAX : true;
    var waitForWaiters = options.hasOwnProperty('waitForWaiters') ? options.waitForWaiters : true;

    return new _ember.default.RSVP.Promise(function (resolve) {
      var watcher = self.setInterval(function () {
        if (waitForTimers && (_ember.default.run.hasScheduledTimers() || _ember.default.run.currentRunLoop)) {
          return;
        }

        if (waitForAJAX && requests && requests.length > 0) {
          return;
        }

        if (waitForWaiters && checkWaiters()) {
          return;
        }

        // Stop polling
        self.clearInterval(watcher);

        // Synchronously resolve the promise
        _ember.default.run(null, resolve);
      }, 10);
    });
  }
});