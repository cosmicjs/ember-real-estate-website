'use strict';

var watcherServerMiddleware = require('./middleware');
var serveAssetMiddleware = require('./serve-asset-middleware');
var watcherMiddleware = require('./watcher-middleware');
var setFileContentResponseHeaders = require('./utils/response-header').setFileContentResponseHeaders;

module.exports = {
  'watcherServerMiddleware': watcherServerMiddleware,
  'serveAssetMiddleware': serveAssetMiddleware,
  'watcherMiddleware': watcherMiddleware,
  'setFileContentResponseHeaders': setFileContentResponseHeaders
}
