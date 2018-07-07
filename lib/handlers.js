/*
 * Request Handlers
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const helpers = require('./helpers');
const config = require('./config');

const _data = require('./data');

const _users = require('./../https/controllers/users');
const _tokens = require('./../https/controllers/tokens');
const _checks = require('./../https/controllers/checks');

// Define all the handlers
var handlers = {};

/**
 * HTML Handlers
 */

// Index Handler
// Index
handlers.index = (data, callback) => {  
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'This is the title',
      'head.description': 'This is the meta description',
      'body.title': 'Hello templated world!',
      'body.class': 'index'
    };
    // Read in a template as a string
    helpers.getTemplate('index', templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Favicon
handlers.favicon = (data, callback) => {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', (err, data) => {
      if (!err && data) {
        // Callback the data
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

handlers.public = (data, callback) => {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Get the filename requested
    var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();    
    if (trimmedAssetName.length > 0) {
      // Read in the assets's data
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && data) {
          // Determine the content-type (default to plain text)
          var contentType = 'plain';

          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }

          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(500);
        }
      });
    } else {
      callback(405);
    }
  } else {
    callback(405);
  }
};

/**
 * JSON API Handlers
 */

// Ping Handler
handlers.ping = (data, callback) => {
  setTimeout(() => {
    callback(200);
  },5000);
};

// Not-Found Handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Users
handlers.users = (data, callback) => {
  var acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users  = _users;

// Tokens
handlers.tokens = (data, callback) => {
  var acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the tokens methods
handlers._tokens  = _tokens;

// Checks
handlers.checks = (data, callback) => {
  var acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the checks methods
handlers._checks  = _checks;

// Export the handlers
module.exports = handlers;
