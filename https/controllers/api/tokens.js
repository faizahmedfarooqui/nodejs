/**
 *  Containers for tokens request handler
 *  
 *  @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const _data = require('./../../../lib/data');
const helpers = require('./../../../lib/helpers');
const config = require('./../../../lib/config');

// Tokens handler methods
var _tokens = {
  // POST
  // Required data: phone, password
  // Optional data: none
  post: (data, callback) => {
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (phone && password) {
      // Lookup the user who matches that phone number
      _data.read('users', phone, (err,userData) => {
        if (!err && userData) {
          // Hash the sent password, and compare it to the password stored in the user object
          var hashedPassword = helpers.hash(password);
          if (hashedPassword == userData.hashedPassword) {
            // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
            var tokenId = helpers.createRandomString(20);
            var expires = Date.now() + 1000 * 60 * 60;
            var tokenObject = {
              'phone' : phone,
              'id' : tokenId,
              'expires' : expires
            };

            // Store the token
            _data.create('tokens', tokenId, tokenObject, (err) => {
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
