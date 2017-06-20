'use strict';

var mime = require('mime');
var url = require('url');
var fs = require('fs');
var path = require('path');

var handlebars = require('handlebars');
var dirTemplate = handlebars.compile(fs.readFileSync(path.resolve(__dirname, '..', 'templates/dir.html')).toString());


function updateFilenameHeader(req, filename) {
  var broccoliInfo = req.headers['x-broccoli'];
  if (broccoliInfo) {
    broccoliInfo.filename = filename;
  }
}

/**
 * Function to update response headers for files served from disk.
 *
 * @param response {HTTP.Request} the incoming request object
 * @param response {HTTP.Response} the outgoing response object
 * @param options {Object} an object containing per request info
 *        [options.filename] {String} absolute filename path
 *        [options.lastModified] {Number} Last modified timestamp (in UTC) for the file
 *        [options.fileSize] {Number} size of the file
 *
 */
var setFileContentResponseHeaders = function(request, response, options) {
  var filename = options.filename;
  var fileSize = options.fileSize;

  var type = mime.lookup(filename);
  var charset = mime.charsets.lookup(type);
  if (charset) {
    type += '; charset=' + charset;
  }
  response.setHeader('Content-Length', fileSize);
  response.setHeader('Content-Type', type);
}

/**
 * Function that sets the outgoing header values (ie the response headers).
 *
 * @param response {HTTP.Request} the incoming request object
 * @param response {HTTP.Response} the outgoing response object
 * @param options {Object} an object containing per request info
 *
 * @return filename {String} the updated file path that is currently being served
 */
var setResponseHeaders = function (request, response, options) {
  var incomingUrl = options.url;
  var urlObj = url.parse(incomingUrl);
  var filename = options.filename;
  var outputPath = options.outputPath;
  var stat;

  // contains null byte or escapes directory
  if (filename.indexOf('\0') !== -1 || filename.indexOf(outputPath) !== 0) {
    response.writeHead(400);
    response.end();
    return;
  }

  try {
    stat = fs.statSync(filename);
  } catch (e) {
    // asset not found
    updateFilenameHeader(request, '');
    return;
  }

  if (stat.isDirectory()) {
    var hasIndex = fs.existsSync(path.join(filename, 'index.html'));

    if (!hasIndex && !options.autoIndex) {
      // if index.html not present and autoIndex is not turned on, move to the next
      // middleware (if present) to find the asset.
      updateFilenameHeader(request, '');
      return;
    }

    // If no trailing slash, redirect. We use path.sep because filename
    // has backslashes on Windows.
    if (filename[filename.length - 1] !== path.sep) {
      urlObj.pathname += '/';
      response.setHeader('Location', url.format(urlObj));
      response.writeHead(301);
      response.end();
      return;
    }

    if (!hasIndex) { // implied: options.autoIndex is true
      var context = {
        url: incomingUrl,
        files: fs.readdirSync(filename).sort().map(function (child) {
          var stat = fs.statSync(path.join(filename,child)),
              isDir = stat.isDirectory();
          return {
            href: child + (isDir ? '/' : ''),
            type: isDir ? 'dir' : path.extname(child).replace('.', '').toLowerCase()
          };
        }),
        liveReloadPath: options.liveReloadPath
      };
      response.writeHead(200);
      response.end(dirTemplate(context));
      return;
    }

    // otherwise serve index.html
    filename += 'index.html';
    stat = fs.statSync(filename);
  }

  // set the response headers for files that are served from the disk
  var lastModified = stat.mtime.toUTCString();
  response.setHeader('Last-Modified', lastModified);

  if (request.headers['if-modified-since'] === lastModified) {
    // nginx style treat last-modified as a tag since browsers echo it back
    response.writeHead(304);
    response.end();
    return;
  }

  setFileContentResponseHeaders(request, response, {
    'filename': filename,
    'lastModified': lastModified,
    'fileSize': stat.size
  });

  updateFilenameHeader(request, filename);
  return filename;
}

module.exports = {
  'setResponseHeaders': setResponseHeaders,
  'setFileContentResponseHeaders': setFileContentResponseHeaders
}
