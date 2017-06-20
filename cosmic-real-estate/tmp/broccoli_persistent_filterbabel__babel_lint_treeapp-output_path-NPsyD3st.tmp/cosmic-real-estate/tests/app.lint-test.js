define('cosmic-real-estate/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/listing.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'adapters/listing.js should pass ESLint\n\n7:17 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/real-estate-listing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/real-estate-listing.js should pass ESLint\n\n');
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

  QUnit.test('serializers/listing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/listing.js should pass ESLint\n\n');
  });
});