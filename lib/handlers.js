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
