'use strict';

define('cosmic-real-estate/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/listing.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'adapters/listing.js should pass ESLint\n\n13:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/real-estate-listing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/real-estate-listing.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/format-price.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/format-price.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/format-upvotes.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/format-upvotes.js should pass ESLint\n\n');
  });

  QUnit.test('models/listing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/listing.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/listings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/listings.js should pass ESLint\n\n');
  });

  QUnit.test('routes/listings/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/listings/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/listings/listing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/listings/listing.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/listing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/listing.js should pass ESLint\n\n');
  });
});
define('cosmic-real-estate/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    _ember.default.run(application, 'destroy');
  }
});
define('cosmic-real-estate/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'cosmic-real-estate/tests/helpers/start-app', 'cosmic-real-estate/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var Promise = _ember.default.RSVP.Promise;
});
define('cosmic-real-estate/tests/helpers/resolver', ['exports', 'cosmic-real-estate/resolver', 'cosmic-real-estate/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('cosmic-real-estate/tests/helpers/start-app', ['exports', 'ember', 'cosmic-real-estate/app', 'cosmic-real-estate/config/environment'], function (exports, _ember, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = _ember.default.merge({}, _environment.default.APP);
    attributes = _ember.default.merge(attributes, attrs); // use defaults, but you can override;

    return _ember.default.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('cosmic-real-estate/tests/integration/components/real-estate-listing-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('real-estate-listing', 'Integration | Component | real estate listing', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "/Qe9aeXr",
      "block": "{\"statements\":[[1,[26,[\"real-estate-listing\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "t8G7ESjJ",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"real-estate-listing\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('cosmic-real-estate/tests/integration/helpers/format-price-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('format-price', 'helper:format-price', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "wC8ObhO3",
      "block": "{\"statements\":[[1,[33,[\"format-price\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('cosmic-real-estate/tests/integration/helpers/format-upvotes-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('format-upvotes', 'helper:format-upvotes', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "g+XRLILv",
      "block": "{\"statements\":[[1,[33,[\"format-upvotes\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('cosmic-real-estate/tests/test-helper', ['cosmic-real-estate/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('cosmic-real-estate/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/real-estate-listing-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/real-estate-listing-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/format-price-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-price-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/format-upvotes-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-upvotes-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/listing-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/listing-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/listings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/listings-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/listings/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/listings/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/listings/listing-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/listings/listing-test.js should pass ESLint\n\n');
  });
});
define('cosmic-real-estate/tests/unit/models/listing-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('listing', 'Unit | Model | listing', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('cosmic-real-estate/tests/unit/routes/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cosmic-real-estate/tests/unit/routes/listings-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:listings', 'Unit | Route | listings', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cosmic-real-estate/tests/unit/routes/listings/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:listings/index', 'Unit | Route | listings/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cosmic-real-estate/tests/unit/routes/listings/listing-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:listings/listing', 'Unit | Route | listings/listing', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
require('cosmic-real-estate/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
