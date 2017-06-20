'use strict';

var url = require('url');
var path = require('path');

var errorHandler = require('./utils/error-handler');

module.exports = function watcherMiddleware(watcher, options) {
  options = options || {};

  if (!options.hasOwnProperty('autoIndex')) {
    // set autoIndex to be true if not provided
    options.autoIndex = true;
  }

  return function(request, response, next) {
    watcher.then(function(hash) {
      var outputPath = path.normalize(hash.directory);

      // set the x-broccoli header containing per request info used by the broccoli-middleware
      var urlToBeServed = request.url;
      var urlObj = url.parse(urlToBeServed);
      var filename = path.join(outputPath, decodeURIComponent(urlObj.pathname));
      var broccoliInfo = {
        'url': urlToBeServed,
        'outputPath': outputPath,
        'filename': filename,
        'autoIndex': options.autoIndex
      };
      request.headers['x-broccoli'] = broccoliInfo;

      // set the default response headers that are independent of the asset
      response.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');

      next();
    }, function(buildError) {

      errorHandler(response, {
        'buildError': buildError,
        'liveReloadPath': options.liveReloadPath
      });
    })
    .catch(function(err) {
      console.log(err);
    })
  }
}
