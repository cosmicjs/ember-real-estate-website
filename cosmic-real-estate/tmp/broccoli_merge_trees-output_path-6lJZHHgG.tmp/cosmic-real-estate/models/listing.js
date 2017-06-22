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
    neighborhood: _emberData.default.attr(),
    beds: _emberData.default.attr(),
    baths: _emberData.default.attr(),
    squareFeet: _emberData.default.attr(),
    zipCode: _emberData.default.attr(),
    content: _emberData.default.attr()
  });
});