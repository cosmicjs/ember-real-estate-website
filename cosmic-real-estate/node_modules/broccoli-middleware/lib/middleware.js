'use strict';

var path = require('path');
var url = require('url');

var setResponseHeaders = require('./utils/response-header').setResponseHeaders;
var serveAsset = require('./utils/serve-asset');
var errorHandler = require('./utils/error-handler');

// You must call watcher.watch() before you call `getMiddleware`
//
// This middleware is for development use only. It hasn't been reviewed
// carefully enough to run on a production server.
//
// Supported options:
//   autoIndex (default: true) - set to false to disable directory listings
//   liveReloadPath - LiveReload script URL for error pages
module.exports = function getMiddleware(watcher, options) {
  options = options || {};

  if (!options.hasOwnProperty('autoIndex')) {
    // set autoIndex to be true if not provided
    options.autoIndex = true;
  }

  return function broccoliMiddleware(request, response, next) {
    watcher.then(function(hash) {
      var outputPath = path.normalize(hash.directory);
      var incomingUrl = request.url;
      var urlObj = url.parse(incomingUrl);
      var filename = path.join(outputPath, decodeURIComponent(urlObj.pathname));

      var updatedFileName = setResponseHeaders(request, response, {
        'url': incomingUrl,
        'filename': filename,
        'outputPath': outputPath,
        'autoIndex': options.autoIndex
      });

      if (updatedFileName) {
        serveAsset(response, {
          'filename': updatedFileName
        });
      } else {
        // bypassing serving assets and call the next middleware
        next();
      }
    }, function(buildError) {
      errorHandler(response, {
        'buildError': buildError,
        'liveReloadPath': options.liveReloadPath
      });
    })
    .catch(function(err) {
      console.log(err.stack);
    });
  };
};
