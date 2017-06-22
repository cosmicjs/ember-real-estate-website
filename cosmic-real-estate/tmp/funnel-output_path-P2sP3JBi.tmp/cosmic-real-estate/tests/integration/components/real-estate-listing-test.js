import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('real-estate-listing', 'Integration | Component | real estate listing', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{real-estate-listing}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#real-estate-listing}}
      template block text
    {{/real-estate-listing}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
