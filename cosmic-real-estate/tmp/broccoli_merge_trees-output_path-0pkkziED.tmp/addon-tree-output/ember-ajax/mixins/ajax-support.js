define('ember-ajax/mixins/ajax-support', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = _ember.default.Mixin,
      service = _ember.default.inject.service,
      alias = _ember.default.computed.alias;
  exports.default = Mixin.create({

    /**
     * The AJAX service to send requests through
     *
     * @property {AjaxService} ajaxService
     * @public
     */
    ajaxService: service('ajax'),

    /**
     * @property {string} host
     * @public
     */
    host: alias('ajaxService.host'),

    /**
     * @property {string} namespace
     * @public
     */
    namespace: alias('ajaxService.namespace'),

    /**
     * @property {object} headers
     * @public
     */
    headers: alias('ajaxService.headers'),

    ajax: function ajax(url) {
      var augmentedOptions = this.ajaxOptions.apply(this, arguments);

      return this.get('ajaxService').request(url, augmentedOptions);
    }
  });
});