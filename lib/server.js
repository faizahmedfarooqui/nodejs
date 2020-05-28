/*
 * Server-related tasks
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const http = require('http');
const https = require('https');
const zlib = require('zlib');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

const router = require('./router');
const config = require('./config');
const handlers = require('./handlers');
const helpers = require('./helpers');

// Instantiate the server module object
var server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

if (config.httpsEnabled) {
  // Instantiate the HTTPS server
  server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
  };

  server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
  });
}

// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  
  var buffer = '';

  // The chunk emitted in each 'data' event is a Buffer. If you know it's going to be 
  // string data, the best thing to do is collect the data in an array, then at 
  // the 'end', concatenate and stringify it.
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    // If the request is within the public directory, use the public handler instead
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

    // Construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the router
    try {
      chosenHandler(data, (statusCode, payload, contentType) => {
        server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType, headers);
      });
    } catch (e) {
      debug(e);
      // On error now we let the requester know that something went wrong on our end
      server.processHandlerResponse(res, method, trimmedPath, 500, {'Error': 'An unknown error has occurred'}, 'json', headers);
    }
  });
};

// Process the response from the handler
server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType, headers) => {  

  // Determine the type of response (fallback to JSON)
  contentType = typeof(contentType) == 'string' ? contentType : 'json';

  // Use the status code returned from the handler, or set the default status code to 200
  statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
  
  // Return the response parts that are content-type specific
  // Use the payload returned from the handler, or set the default payload to an empty object
  // Convert the payload to a string
  var payloadString = '';
  if (contentType == 'json') {
    res.setHeader('Content-Type', 'application/json');
    payload = typeof(payload) == 'object' ? payload : {};
    payloadString = JSON.stringify(payload);
  }

  if (contentType == 'html') {
    res.setHeader('Content-Type', 'text/html');
    payloadString = typeof(payload) == 'string' ? payload : '';
  }

  if (contentType == 'favicon') {
    res.setHeader('Content-Type', 'image/x-icon');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if (contentType == 'css') {
    res.setHeader('Content-Type', 'text/css');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if (contentType == 'jpg') {
    res.setHeader('Content-Type', 'image/jpeg');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if (contentType == 'png') {
    res.setHeader('Content-Type', 'image/png');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  if (contentType == 'plain') {
    res.setHeader('Content-Type', 'text/plain');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }

  // Check if the browser accepts encodings
  var acceptEncoding = headers.hasOwnProperty('accept-encoding') ? headers['accept-encoding'] : '';

  // 
  // Return the response parts that are common to all content-types
  // 
  // Note: This is not a conformant accept-encoding parser.
  // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    res.writeHead(statusCode, { 'Content-Encoding': 'deflate' });
    // Deflate the payloadString if browser accepts deflate encoding
    zlib.deflate(payloadString, function(err, buffer) {
      if (!err) {
        res.end(buffer);
      }
    });

  } else if (/\bgzip\b/.test(acceptEncoding)) {
    res.writeHead(statusCode, { 'Content-Encoding': 'gzip' });
    // Gzip the payloadString if browser accepts gzip encoding
    zlib.gzip(payloadString, function(err, buffer) {
      if (!err) {
        res.end(buffer);
      }
    });
  } else {
    res.writeHead(statusCode, {});
    res.end(payloadString);
  }

  // If the response is 200, print green, otherwise print red
  if(statusCode == 200){
    debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
  } else {
    debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
  }
};

// Init script
server.init = () => {
  // Start the HTTP server
  server.httpServer.listen(process.env.PORT || config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port '+process.env.PORT);
  });

  if (config.httpsEnabled) {
  // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, () => {
      console.log('\x1b[35m%s\x1b[0m','The HTTPS server is running on port '+config.httpsPort);
    });
  }
};

// Define the request router
server.router = router;

// Export the module
module.exports = server;
