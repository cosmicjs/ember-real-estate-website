define('ember-cli-qunit', ['exports', 'ember', 'qunit', 'ember-qunit', 'ember-cli-test-loader/test-support/index'], function (exports, _ember, _qunit, _emberQunit, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TestLoader = undefined;
  exports.setupTestContainer = setupTestContainer;
  exports.loadTests = loadTests;
  exports.startTests = startTests;
  exports.setupTestAdapter = setupTestAdapter;
  exports.start = start;

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

  (0, _index.addModuleExcludeMatcher)(function (moduleName) {
    return _qunit.default.urlParams.nolint && moduleName.match(/\.(jshint|lint-test)$/);
  });

  (0, _index.addModuleIncludeMatcher)(function (moduleName) {
    return moduleName.match(/\.jshint$/);
  });

  var moduleLoadFailures = [];

  _qunit.default.done(function () {
    if (moduleLoadFailures.length) {
      throw new Error('\n' + moduleLoadFailures.join('\n'));
    }
  });

  var TestLoader = exports.TestLoader = function (_AbstractTestLoader) {
    _inherits(TestLoader, _AbstractTestLoader);

    function TestLoader() {
      _classCallCheck(this, TestLoader);

      return _possibleConstructorReturn(this, (TestLoader.__proto__ || Object.getPrototypeOf(TestLoader)).apply(this, arguments));
    }

    _createClass(TestLoader, [{
      key: 'moduleLoadFailure',
      value: function moduleLoadFailure(moduleName, error) {
        moduleLoadFailures.push(error);

        _qunit.default.module('TestLoader Failures');
        _qunit.default.test(moduleName + ': could not be loaded', function () {
          throw error;
        });
      }
    }]);

    return TestLoader;
  }(_index.default);

  /**
     Uses current URL configuration to setup the test container.
  
     * If `?nocontainer` is set, the test container will be hidden.
     * If `?dockcontainer` or `?devmode` are set the test container will be
       absolutely positioned.
     * If `?devmode` is set, the test container will be made full screen.
  
     @method setupTestContainer
   */
  function setupTestContainer() {
    var testContainer = document.getElementById('ember-testing-container');
    if (!testContainer) {
      return;
    }

    var params = _qunit.default.urlParams;

    var containerVisibility = params.nocontainer ? 'hidden' : 'visible';
    var containerPosition = params.dockcontainer || params.devmode ? 'absolute' : 'relative';

    if (params.devmode) {
      testContainer.className = ' full-screen';
    }

    testContainer.style.visibility = containerVisibility;
    testContainer.style.position = containerPosition;
  }

  /**
     Load tests following the default patterns:
  
     * The module name ends with `-test`
     * The module name ends with `.jshint`
  
     Excludes tests that match the following
     patterns when `?nolint` URL param is set:
  
     * The module name ends with `.jshint`
     * The module name ends with `-lint-test`
  
     @method loadTests
   */
  function loadTests() {
    new TestLoader().loadModules();
  }

  /**
     Instruct QUnit to start the tests.
     @method startTests
   */
  function startTests() {
    _qunit.default.start();
  }

  /**
     Sets up the `Ember.Test` adapter for usage with QUnit 2.x.
  
     @method setupTestAdapter
   */
  function setupTestAdapter() {
    _ember.default.Test.adapter = _emberQunit.QUnitAdapter.create();
  }

  /**
     @method start
     @param {Object} [options] Options to be used for enabling/disabling behaviors
     @param {Boolean} [options.loadTests] If `false` tests will not be loaded automatically.
     @param {Boolean} [options.setupTestContainer] If `false` the test container will not
     be setup based on `devmode`, `dockcontainer`, or `nocontainer` URL params.
     @param {Boolean} [options.startTests] If `false` tests will not be automatically started
     (you must run `QUnit.start()` to kick them off).
     @param {Boolean} [options.setupTestAdapter] If `false` the default Ember.Test adapter will
     not be updated.
   */
  function start() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (options.loadTests !== false) {
      loadTests();
    }

    if (options.setupTestContainer !== false) {
      setupTestContainer();
    }

    if (options.setupTestAdapter !== false) {
      setupTestAdapter();
    }

    if (options.startTests !== false) {
      startTests();
    }
  }
});