/*
 * Request Handlers
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const helpers = require('./helpers');
const config = require('./config');

const _data = require('./data');

// Web Controllers
const _asset  = require('./../https/controllers/web/asset');
const _index  = require('./../https/controllers/web/index');
const _account = require('./../https/controllers/web/account');
const _session = require('./../https/controllers/web/session');
const _check = require('./../https/controllers/web/check');

// RESTful API Controllers
const _users = require('./../https/controllers/api/users');
const _tokens = require('./../https/controllers/api/tokens');
const _checks = require('./../https/controllers/api/checks');

// Define all the handlers
var handlers = {};

/**
 * HTML Handlers
 */

// Index Handler
handlers.index = _index;

// Create Account
handlers.accountCreate = _account.accountCreate;

// Edit Account
handlers.accountEdit = _account.accountEdit;

// Account has been deleted
handlers.accountDeleted = _account.accountDeleted;

// Create Session
handlers.sessionCreate = _session.sessionCreate;

// Session has been deleted
handlers.sessionDeleted = _session.sessionDeleted;

// Create a new check
handlers.checksCreate = _check.checksCreate;

// Dashboard ie. View all Checks
handlers.checksList = _check.checksList;

// Edit Checks Details
handlers.checksEdit = _check.checksEdit;

// Favicon
handlers.favicon = _asset.favicon;

// Get public assets
handlers.public = _asset.public;

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
