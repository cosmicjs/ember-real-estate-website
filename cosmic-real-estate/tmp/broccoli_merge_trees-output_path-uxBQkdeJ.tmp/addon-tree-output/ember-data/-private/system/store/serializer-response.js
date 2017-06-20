define('ember-data/-private/system/store/serializer-response', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _debug) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validateDocumentStructure = validateDocumentStructure;
  exports.normalizeResponseHelper = normalizeResponseHelper;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /*
    This is a helper method that validates a JSON API top-level document
  
    The format of a document is described here:
    http://jsonapi.org/format/#document-top-level
  
    @method validateDocumentStructure
    @param {Object} doc JSON API document
    @return {array} An array of errors found in the document structure
  */
  function validateDocumentStructure(doc) {
    var errors = [];
    if (!doc || (typeof doc === 'undefined' ? 'undefined' : _typeof(doc)) !== 'object') {
      errors.push('Top level of a JSON API document must be an object');
    } else {
      if (!('data' in doc) && !('errors' in doc) && !('meta' in doc)) {
        errors.push('One or more of the following keys must be present: "data", "errors", "meta".');
      } else {
        if ('data' in doc && 'errors' in doc) {
          errors.push('Top level keys "errors" and "data" cannot both be present in a JSON API document');
        }
      }
      if ('data' in doc) {
        if (!(doc.data === null || Array.isArray(doc.data) || _typeof(doc.data) === 'object')) {
          errors.push('data must be null, an object, or an array');
        }
      }
      if ('meta' in doc) {
        if (_typeof(doc.meta) !== 'object') {
          errors.push('meta must be an object');
        }
      }
      if ('errors' in doc) {
        if (!Array.isArray(doc.errors)) {
          errors.push('errors must be an array');
        }
      }
      if ('links' in doc) {
        if (_typeof(doc.links) !== 'object') {
          errors.push('links must be an object');
        }
      }
      if ('jsonapi' in doc) {
        if (_typeof(doc.jsonapi) !== 'object') {
          errors.push('jsonapi must be an object');
        }
      }
      if ('included' in doc) {
        if (_typeof(doc.included) !== 'object') {
          errors.push('included must be an array');
        }
      }
    }

    return errors;
  }

  /*
    This is a helper method that always returns a JSON-API Document.
  
    @method normalizeResponseHelper
    @param {DS.Serializer} serializer
    @param {DS.Store} store
    @param {subclass of DS.Model} modelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */
  function normalizeResponseHelper(serializer, store, modelClass, payload, id, requestType) {
    var normalizedResponse = serializer.normalizeResponse(store, modelClass, payload, id, requestType);
    var validationErrors = [];
    (0, _debug.runInDebug)(function () {
      validationErrors = validateDocumentStructure(normalizedResponse);
    });
    (0, _debug.assert)('normalizeResponse must return a valid JSON API document:\n\t* ' + validationErrors.join('\n\t* '), _ember.default.isEmpty(validationErrors));

    return normalizedResponse;
  }
});