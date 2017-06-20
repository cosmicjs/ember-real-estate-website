'use strict';

var fs = require('fs');

/**
 * Function that serves the current request asset from disk.
 *
 * @param response {HTTP.Response} the outgoing response object
 * @param options {Object} an object containing per request info
 *
 */
module.exports = function serveAsset(response, options) {
  // read file sync so we don't hold open the file creating a race with
  // the builder (Windows does not allow us to delete while the file is open).
  var filename = options.filename;
  var buffer = fs.readFileSync(filename);
  response.writeHead(200);
  response.end(buffer);
}
