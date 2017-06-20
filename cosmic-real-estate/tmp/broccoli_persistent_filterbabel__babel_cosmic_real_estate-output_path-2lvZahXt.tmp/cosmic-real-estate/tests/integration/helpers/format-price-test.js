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