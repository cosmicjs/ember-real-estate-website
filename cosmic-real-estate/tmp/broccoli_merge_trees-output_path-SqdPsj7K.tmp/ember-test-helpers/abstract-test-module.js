define('ember-test-helpers/abstract-test-module', ['exports', 'ember-test-helpers/wait', 'ember-test-helpers/test-context', 'ember'], function (exports, _wait, _testContext, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  // calling this `merge` here because we cannot
  // actually assume it is like `Object.assign`
  // with > 2 args
  var merge = _ember.default.assign || _ember.default.merge;

  var _class = function () {
    function _class(name, options) {
      _classCallCheck(this, _class);

      this.context = undefined;
      this.name = name;
      this.callbacks = options || {};

      this.initSetupSteps();
      this.initTeardownSteps();
    }

    _createClass(_class, [{
      key: 'setup',
      value: function setup(assert) {
        var _this = this;

        return this.invokeSteps(this.setupSteps, this, assert).then(function () {
          _this.contextualizeCallbacks();
          return _this.invokeSteps(_this.contextualizedSetupSteps, _this.context, assert);
        });
      }
    }, {
      key: 'teardown',
      value: function teardown(assert) {
        var _this2 = this;

        return this.invokeSteps(this.contextualizedTeardownSteps, this.context, assert).then(function () {
          return _this2.invokeSteps(_this2.teardownSteps, _this2, assert);
        }).then(function () {
          _this2.cache = null;
          _this2.cachedCalls = null;
        });
      }
    }, {
      key: 'initSetupSteps',
      value: function initSetupSteps() {
        this.setupSteps = [];
        this.contextualizedSetupSteps = [];

        if (this.callbacks.beforeSetup) {
          this.setupSteps.push(this.callbacks.beforeSetup);
          delete this.callbacks.beforeSetup;
        }

        this.setupSteps.push(this.setupContext);
        this.setupSteps.push(this.setupTestElements);
        this.setupSteps.push(this.setupAJAXListeners);

        if (this.callbacks.setup) {
          this.contextualizedSetupSteps.push(this.callbacks.setup);
          delete this.callbacks.setup;
        }
      }
    }, {
      key: 'invokeSteps',
      value: function invokeSteps(steps, context, assert) {
        steps = steps.slice();

        function nextStep() {
          var step = steps.shift();
          if (step) {
            // guard against exceptions, for example missing components referenced from needs.
            return new _ember.default.RSVP.Promise(function (resolve) {
              resolve(step.call(context, assert));
            }).then(nextStep);
          } else {
            return _ember.default.RSVP.resolve();
          }
        }
        return nextStep();
      }
    }, {
      key: 'contextualizeCallbacks',
      value: function contextualizeCallbacks() {}
    }, {
      key: 'initTeardownSteps',
      value: function initTeardownSteps() {
        this.teardownSteps = [];
        this.contextualizedTeardownSteps = [];

        if (this.callbacks.teardown) {
          this.contextualizedTeardownSteps.push(this.callbacks.teardown);
          delete this.callbacks.teardown;
        }

        this.teardownSteps.push(this.teardownContext);
        this.teardownSteps.push(this.teardownTestElements);
        this.teardownSteps.push(this.teardownAJAXListeners);

        if (this.callbacks.afterTeardown) {
          this.teardownSteps.push(this.callbacks.afterTeardown);
          delete this.callbacks.afterTeardown;
        }
      }
    }, {
      key: 'setupTestElements',
      value: function setupTestElements() {
        var testEl = document.querySelector('#ember-testing');
        if (!testEl) {
          var element = document.createElement('div');
          element.setAttribute('id', 'ember-testing');

          document.body.appendChild(element);
          this.fixtureResetValue = '';
        } else {
          this.fixtureResetValue = testEl.innerHTML;
        }
      }
    }, {
      key: 'setupContext',
      value: function setupContext(options) {
        var context = this.getContext();

        merge(context, {
          dispatcher: null,
          inject: {}
        });
        merge(context, options);

        this.setToString();
        (0, _testContext.setContext)(context);
        this.context = context;
      }
    }, {
      key: 'setContext',
      value: function setContext(context) {
        this.context = context;
      }
    }, {
      key: 'getContext',
      value: function getContext() {
        if (this.context) {
          return this.context;
        }

        return this.context = (0, _testContext.getContext)() || {};
      }
    }, {
      key: 'setToString',
      value: function setToString() {
        var _this3 = this;

        this.context.toString = function () {
          if (_this3.subjectName) {
            return 'test context for: ' + _this3.subjectName;
          }

          if (_this3.name) {
            return 'test context for: ' + _this3.name;
          }
        };
      }
    }, {
      key: 'setupAJAXListeners',
      value: function setupAJAXListeners() {
        (0, _wait._setupAJAXHooks)();
      }
    }, {
      key: 'teardownAJAXListeners',
      value: function teardownAJAXListeners() {
        (0, _wait._teardownAJAXHooks)();
      }
    }, {
      key: 'teardownTestElements',
      value: function teardownTestElements() {
        document.getElementById('ember-testing').innerHTML = this.fixtureResetValue;

        // Ember 2.0.0 removed Ember.View as public API, so only do this when
        // Ember.View is present
        if (_ember.default.View && _ember.default.View.views) {
          _ember.default.View.views = {};
        }
      }
    }, {
      key: 'teardownContext',
      value: function teardownContext() {
        var context = this.context;
        this.context = undefined;
        (0, _testContext.unsetContext)();

        if (context && context.dispatcher && !context.dispatcher.isDestroyed) {
          _ember.default.run(function () {
            context.dispatcher.destroy();
          });
        }
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});