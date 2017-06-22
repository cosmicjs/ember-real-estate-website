define('ember-test-helpers/-legacy-overrides', ['exports', 'ember', 'ember-test-helpers/has-ember-version'], function (exports, _ember, _hasEmberVersion) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.preGlimmerSetupIntegrationForComponent = preGlimmerSetupIntegrationForComponent;
  function preGlimmerSetupIntegrationForComponent() {
    var module = this;
    var context = this.context;

    this.actionHooks = {};

    context.dispatcher = this.container.lookup('event_dispatcher:main') || _ember.default.EventDispatcher.create();
    context.dispatcher.setup({}, '#ember-testing');
    context.actions = module.actionHooks;

    (this.registry || this.container).register('component:-test-holder', _ember.default.Component.extend());

    context.render = function (template) {
      // in case `this.render` is called twice, make sure to teardown the first invocation
      module.teardownComponent();

      if (!template) {
        throw new Error("in a component integration test you must pass a template to `render()`");
      }
      if (_ember.default.isArray(template)) {
        template = template.join('');
      }
      if (typeof template === 'string') {
        template = _ember.default.Handlebars.compile(template);
      }
      module.component = module.container.lookupFactory('component:-test-holder').create({
        layout: template
      });

      module.component.set('context', context);
      module.component.set('controller', context);

      _ember.default.run(function () {
        module.component.appendTo('#ember-testing');
      });

      context._element = module.component.element;
    };

    context.$ = function () {
      return module.component.$.apply(module.component, arguments);
    };

    context.set = function (key, value) {
      var ret = _ember.default.run(function () {
        return _ember.default.set(context, key, value);
      });

      if ((0, _hasEmberVersion.default)(2, 0)) {
        return ret;
      }
    };

    context.setProperties = function (hash) {
      var ret = _ember.default.run(function () {
        return _ember.default.setProperties(context, hash);
      });

      if ((0, _hasEmberVersion.default)(2, 0)) {
        return ret;
      }
    };

    context.get = function (key) {
      return _ember.default.get(context, key);
    };

    context.getProperties = function () {
      var args = Array.prototype.slice.call(arguments);
      return _ember.default.getProperties(context, args);
    };

    context.on = function (actionName, handler) {
      module.actionHooks[actionName] = handler;
    };

    context.send = function (actionName) {
      var hook = module.actionHooks[actionName];
      if (!hook) {
        throw new Error("integration testing template received unexpected action " + actionName);
      }
      hook.apply(module, Array.prototype.slice.call(arguments, 1));
    };

    context.clearRender = function () {
      module.teardownComponent();
    };
  }
});