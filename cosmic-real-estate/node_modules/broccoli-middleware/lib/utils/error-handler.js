'use strict';

var fs = require('fs');
var path = require('path');

var handlebars = require('handlebars');
var errorTemplate = handlebars.compile(fs.readFileSync(path.resolve(__dirname, '..', 'templates/error.html')).toString());

module.exports = function errorHandler(response, options) {
  // All errors thrown from builder.build() are guaranteed to be
  // Builder.BuildError instances.
  var buildError = options.buildError;

  var context = {
    stack: buildError.stack,
    liveReloadPath: options.liveReloadPath,
    payload: buildError.broccoliPayload
  };
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(500);
  response.end(errorTemplate(context));
}
