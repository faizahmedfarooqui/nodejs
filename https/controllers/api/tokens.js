/**
 *  Containers for tokens request handler
 *  
 *  @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const _data = require('./../../../lib/data');
const helpers = require('./../../../lib/helpers');
const config = require('./../../../lib/config');

const _performance = require('perf_hooks').performance;
const _performanceObserver = require('perf_hooks').PerformanceObserver;
const util = require('util');
const debug = util.debuglog('performance');

// Start observing the performance from start
const obs = new _performanceObserver((list, observer) => {
  // Get the list of all performance measures
  const entries = list.getEntries();
  entries.forEach((entry) => {
    // Log out all the measurements
    debug('\x1b[33m%s\x1b[0m', entry.name + ': ' + entry.duration);
  });

  // Disconnect observers
  obs.disconnect();
});

// Fetch all the "measure" module performance
obs.observe({entryTypes: ['measure'], buffered: true});

// Tokens handler methods
var _tokens = {
  // POST
  // Required data: phone, password
  // Optional data: none
  post: (data, callback) => {
    _performance.mark('entered function');
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    _performance.mark('inputs validated');
    if (phone && password) {
      _performance.mark('beginning user lookup');
      // Lookup the user who matches that phone number
      _data.read('users', phone, (err,userData) => {
        _performance.mark('user lookup complete');
        if (!err && userData) {
          // Hash the sent password, and compare it to the password stored in the user object
          _performance.mark('beginning password hashing');
          var hashedPassword = helpers.hash(password);
          _performance.mark('password hashing complete');
          if (hashedPassword == userData.hashedPassword) {
            // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
            _performance.mark('creating data for the token');
            var tokenId = helpers.createRandomString(20);
            var expires = Date.now() + 1000 * 60 * 60;
            var tokenObject = {
              'phone' : phone,
              'id' : tokenId,
              'expires' : expires
            };

            // Store the token
            _performance.mark('beginning storing token');
            _data.create('tokens', tokenId, tokenObject, (err) => {
              _performance.mark('storing token complete');

              // Gather all the measurements
              _performance.measure('Validating User Input', 'entered function', 'inputs validated');
              _performance.measure('User Lookup', 'beginning user lookup', 'user lookup complete');
              _performance.measure('Password Hashing', 'beginning password hashing', 'password hashing complete');
              _performance.measure('Token Data Creation', 'creating data for the token', 'beginning storing token');
              _performance.measure('Token Storing', 'beginning storing token', 'storing token complete');
              _performance.measure('Beginning to End', 'entered function', 'storing token complete');

              if (! err) {
                callback(200,tokenObject);
              } else {
                callback(500, {'Error': 'Could not create the new token'});
              }
            });
          } else {
            callback(400, {'Error': 'Password did not match the specified user\'s stored password'});
          }
        } else {
          callback(400, {'Error': 'Could not find the specified user.'});
        }
      });
    } else {
      callback(400, {'Error': 'Missing required field(s).'});
    }
  },

  // GET
  // Required data: id
  // Optional data: none
  get: (data, callback) => {
    // Check that id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
      // Lookup the token
      _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          callback(200,tokenData);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400, {'Error': 'Missing required field, or field invalid'});
    }
  },

  // PUT
  // Required data: id, extend
  // Optional data: none
  put: (data, callback) => {
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if (id && extend) {
      // Lookup the existing token
      _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          // Check to make sure the token isn't already expired
          if (tokenData.expires > Date.now()) {
            // Set the expiration an hour from now
            tokenData.expires = Date.now() + 1000 * 60 * 60;
            // Store the new updates
            _data.update('tokens', id, tokenData, (err) => {
              if (! err) {
                callback(200);
              } else {
                callback(500, {'Error': 'Could not update the token\'s expiration.'});
              }
            });
          } else {
            callback(400, {'Error': 'The token has already expired, and cannot be extended.'});
          }
        } else {
          callback(400, {'Error': 'Specified user does not exist.'});
        }
      });
    } else {
      callback(400, {'Error': 'Missing required field(s) or field(s) are invalid.'});
    }
  },

  // DELETE
  // Required data: id
  // Optional data: none
  delete: (data, callback) => {
    // Check that id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
      // Lookup the token
      _data.read('tokens', id, (err,tokenData) => {
        if (!err && tokenData) {
          // Delete the token
          _data.delete('tokens', id, (err) => {
            if (! err) {
              callback(200);
            } else {
              callback(500, {'Error': 'Could not delete the specified token'});
            }
          });
        } else {
          callback(400, {'Error': 'Could not find the specified token.'});
        }
      });
    } else {
      callback(400, {'Error': 'Missing required field'})
    }
  },

  // Verify if a given token id is currently valid for a given user
  verifyToken: (id, phone, callback) => {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        // Check that the token is for the given user and has not expired
        if (tokenData.phone == phone && tokenData.expires > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  }
};

// Export tokens controller modules
module.exports = _tokens;
