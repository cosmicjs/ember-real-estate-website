define('cosmic-real-estate/models/listing', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    title: _emberData.default.attr(),
    price: _emberData.default.attr(),
    address: _emberData.default.attr(),
    profileImage: _emberData.default.attr(),
    style: _emberData.default.attr(),
    location: _emberData.default.attr()
  });
});