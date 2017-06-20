define('ember-test-helpers/test-module-for-integration', ['exports', 'ember', 'ember-test-helpers/abstract-test-module', 'ember-test-helpers/test-resolver', 'ember-test-helpers/build-registry', 'ember-test-helpers/has-ember-version', 'ember-test-helpers/-legacy-overrides', 'ember-test-helpers/test-module-for-component'], function (exports, _ember, _abstractTestModule, _testResolver, _buildRegistry, _hasEmberVersion, _legacyOverrides, _testModuleForComponent) {
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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var isPreGlimmer = !(0, _hasEmberVersion.default)(1, 13);

  var _class = function (_AbstractTestModule) {
    _inherits(_class, _AbstractTestModule);

    function _class() {
      _classCallCheck(this, _class);

      var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));

      _this2.resolver = _this2.callbacks.resolver || (0, _testResolver.getResolver)();
      return _this2;
    }

    _createClass(_class, [{
      key: 'initSetupSteps',
      value: function initSetupSteps() {
        this.setupSteps = [];
        this.contextualizedSetupSteps = [];

        if (this.callbacks.beforeSetup) {
          this.setupSteps.push(this.callbacks.beforeSetup);
          delete this.callbacks.beforeSetup;
        }

        this.setupSteps.push(this.setupContainer);
        this.setupSteps.push(this.setupContext);
        this.setupSteps.push(this.setupTestElements);
        this.setupSteps.push(this.setupAJAXListeners);
        this.setupSteps.push(this.setupComponentIntegrationTest);

        if (_ember.default.View && _ember.default.View.views) {
          this.setupSteps.push(this._aliasViewRegistry);
        }

        if (this.callbacks.setup) {
          this.contextualizedSetupSteps.push(this.callbacks.setup);
          delete this.callbacks.setup;
        }
      }
    }, {
      key: 'initTeardownSteps',
      value: function initTeardownSteps() {
        this.teardownSteps = [];
        this.contextualizedTeardownSteps = [];

        if (this.callbacks.teardown) {
          this.contextualizedTeardownSteps.push(this.callbacks.teardown);
          delete this.callbacks.teardown;
        }

        this.teardownSteps.push(this.teardownContainer);
        this.teardownSteps.push(this.teardownContext);
        this.teardownSteps.push(this.teardownAJAXListeners);
        this.teardownSteps.push(this.teardownComponent);

        if (_ember.default.View && _ember.default.View.views) {
          this.teardownSteps.push(this._resetViewRegistry);
        }

        this.teardownSteps.push(this.teardownTestElements);

        if (this.callbacks.afterTeardown) {
          this.teardownSteps.push(this.callbacks.afterTeardown);
          delete this.callbacks.afterTeardown;
        }
      }
    }, {
      key: 'setupContainer',
      value: function setupContainer() {
        var resolver = this.resolver;
        var items = (0, _buildRegistry.default)(resolver);

        this.container = items.container;
        this.registry = items.registry;

        if ((0, _hasEmberVersion.default)(1, 13)) {
          var thingToRegisterWith = this.registry || this.container;
          var router = resolver.resolve('router:main');
          router = router || _ember.default.Router.extend();
          thingToRegisterWith.register('router:main', router);
        }
      }
    }, {
      key: 'setupContext',
      value: function setupContext() {
        var subjectName = this.subjectName;
        var container = this.container;

        var factory = function factory() {
          return container.factoryFor ? container.factoryFor(subjectName) : container.lookupFactory(subjectName);
        };

        _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'setupContext', this).call(this, {
          container: this.container,
          registry: this.registry,
          factory: factory,
          register: function register() {
            var target = this.registry || this.container;
            return target.register.apply(target, arguments);
          }
        });

        var context = this.context;

        if (_ember.default.setOwner) {
          _ember.default.setOwner(context, this.container.owner);
        }

        if (_ember.default.inject) {
          var keys = (Object.keys || _ember.default.keys)(_ember.default.inject);
          keys.forEach(function (typeName) {
            context.inject[typeName] = function (name, opts) {
              var alias = opts && opts.as || name;
              _ember.default.run(function () {
                _ember.default.set(context, alias, context.container.lookup(typeName + ':' + name));
              });
            };
          });
        }

        // only setup the injection if we are running against a version
        // of Ember that has `-view-registry:main` (Ember >= 1.12)
        if (this.container.factoryFor ? this.container.factoryFor('-view-registry:main') : this.container.lookupFactory('-view-registry:main')) {
          (this.registry || this.container).injection('component', '_viewRegistry', '-view-registry:main');
        }
      }
    }, {
      key: 'setupComponentIntegrationTest',
      value: function setupComponentIntegrationTest() {
        if (isPreGlimmer) {
          return _legacyOverrides.preGlimmerSetupIntegrationForComponent.apply(this, arguments);
        } else {
          return _testModuleForComponent.setupComponentIntegrationTest.apply(this, arguments);
        }
      }
    }, {
      key: 'teardownComponent',
      value: function teardownComponent() {
        var component = this.component;
        if (component) {
          _ember.default.run(function () {
            component.destroy();
          });
        }
      }
    }, {
      key: 'teardownContainer',
      value: function teardownContainer() {
        var container = this.container;
        _ember.default.run(function () {
          container.destroy();
        });
      }
    }, {
      key: 'contextualizeCallbacks',
      value: function contextualizeCallbacks() {
        var callbacks = this.callbacks;
        var context = this.context;

        this.cache = this.cache || {};
        this.cachedCalls = this.cachedCalls || {};

        var keys = (Object.keys || _ember.default.keys)(callbacks);
        var keysLength = keys.length;

        if (keysLength) {
          for (var i = 0; i < keysLength; i++) {
            this._contextualizeCallback(context, keys[i], context);
          }
        }
      }
    }, {
      key: '_contextualizeCallback',
      value: function _contextualizeCallback(context, key, callbackContext) {
        var _this = this;
        var callbacks = this.callbacks;
        var factory = context.factory;

        context[key] = function (options) {
          if (_this.cachedCalls[key]) {
            return _this.cache[key];
          }

          var result = callbacks[key].call(callbackContext, options, factory());

          _this.cache[key] = result;
          _this.cachedCalls[key] = true;

          return result;
        };
      }
    }, {
      key: '_aliasViewRegistry',
      value: function _aliasViewRegistry() {
        this._originalGlobalViewRegistry = _ember.default.View.views;
        var viewRegistry = this.container.lookup('-view-registry:main');

        if (viewRegistry) {
          _ember.default.View.views = viewRegistry;
        }
      }
    }, {
      key: '_resetViewRegistry',
      value: function _resetViewRegistry() {
        _ember.default.View.views = this._originalGlobalViewRegistry;
      }
    }]);

    return _class;
  }(_abstractTestModule.default);

  exports.default = _class;
});