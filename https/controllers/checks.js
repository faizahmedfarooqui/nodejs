/**
 *  Containers for checks request handler
 *  
 *  @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const _data = require('./../../lib/data');
const helpers = require('./../../lib/helpers');
const config = require('./../../lib/config');

const _tokens = require('./tokens');

// Checks handler methods
var _checks = {
  // POST
  // Required data: protocol, url, method, successCodes, timeoutSeconds
  // Optional data: none
  post: (data, callback) => {
    // Validate inputs
    var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
    if (protocol && url && method && successCodes && timeoutSeconds) {

      // Get token from headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      // Lookup the user phone by reading the token
      _data.read('tokens', token, function(err, tokenData) {
        if (!err && tokenData) {
          var userPhone = tokenData.phone;

          // Lookup the user data
          _data.read('users', userPhone, (err, userData) => {
            if (!err && userData) {
              var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
              // Verify that user has less than the number of max-checks per user
              if (userChecks.length < config.maxChecks) {
                // Create random id for check
                var checkId = helpers.createRandomString(20);

                // Create check object including userPhone
                var checkObject = {
                  id: checkId,
                  userPhone: userPhone,
                  protocol: protocol,
                  url: url,
                  method: method,
                  successCodes: successCodes,
                  timeoutSeconds: timeoutSeconds
                };

                // Save the object
                _data.create('checks', checkId, checkObject, (err) => {
                  if (! err) {
                    // Add check id to the user's object
                    userData.checks = userChecks;
                    userData.checks.push(checkId);

                    // Save the new user data
                    _data.update('users', userPhone, userData, (err) => {
                      if (! err) {
                        // Return the data about the new check
                        callback(200, checkObject);
                      } else {
                        callback(500, {'Error': 'Could not update the user with the new check.'});
                      }
                    });
                  } else {
                    callback(500, {'Error': 'Could not create the new check'});
                  }
                });
              } else {
                callback(400, {'Error': 'The user already has the maximum number of checks ('+config.maxChecks+').'});
              }
            } else {
              callback(403);
            }
          });
        } else {
          callback(403);
        }
      });
    } else {
      callback(400, {'Error': 'Missing required inputs, or inputs are invalid'});
    }
  },

  // GET
  // Required data: id
  // Optional data: none
  get: (data, callback) => {
    // Check that id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
      // Lookup the check
      _data.read('checks', id, (err, checkData) => {
        if (!err && checkData) {
          // Get the token that sent the request
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
          // Verify that the given token is valid and belongs to the user who created the check
          _tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              // Return check data
              callback(200,checkData);
            } else {
              callback(403);
            }
          });
        } else {
          callback(404);
        }
      });
    } else {
      callback(400, {'Error': 'Missing required field, or field invalid'});
    }
  },

  // PUT
  // Required data: id
  // Optional data: protocol, url, method, successCodes, timeoutSeconds (one must be sent)
  put: (data, callback) => {
    // Check for required field
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

    // Check for optional fields
    var protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    // Error if id is invalid
    if (id) {
      // Error if nothing is sent to update
      if (protocol || url || method || successCodes || timeoutSeconds) {
        // Lookup the check
        _data.read('checks', id,  (err, checkData) => {
          if (!err && checkData) {
            // Get the token that sent the request
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            // Verify that the given token is valid and belongs to the user who created the check
            _tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                // Update check data where necessary
                if (protocol) {
                  checkData.protocol = protocol;
                }
                if (url) {
                  checkData.url = url;
                }
                if (method) {
                  checkData.method = method;
                }
                if (successCodes) {
                  checkData.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkData.timeoutSeconds = timeoutSeconds;
                }

                // Store the new updates
                _data.update('checks',id,checkData, (err) => {
                  if (! err) {
                    callback(200);
                  } else {
                    callback(500, {'Error': 'Could not update the check.'});
                  }
                });
              } else {
                callback(403);
              }
            });
          } else {
            callback(400, {'Error': 'Check ID did not exist.'});
          }
        });
      } else {
        callback(400, {'Error': 'Missing fields to update.'});
      }
    } else {
      callback(400, {'Error': 'Missing required field.'});
    }
  },

  // DELETE
  // Required data: id
  // Optional data: none
  delete: (data, callback) => {
    // Check that id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
      // Lookup the check
      _data.read('checks', id, (err,  checkData) => {
        if (!err && checkData) {
          // Get the token that sent the request
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
          // Verify that the given token is valid and belongs to the user who created the check
          _tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {

              // Delete the check data
              _data.delete('checks', id, (err) => {
                if (! err) {
                  // Lookup the user's object to get all their checks
                  _data.read('users', checkData.userPhone, (err, userData) => {
                    if (! err) {
                      var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                      // Remove the deleted check from their list of checks
                      var checkPosition = userChecks.indexOf(id);
                      if (checkPosition > -1) {
                        userChecks.splice(checkPosition,1);
                        // Re-save the user's data
                        userData.checks = userChecks;
                        _data.update('users', checkData.userPhone, userData, (err) => {
                          if (! err) {
                            callback(200);
                          } else {
                            callback(500, {'Error': 'Could not update the user.'});
                          }
                        });
                      } else {
                        callback(500, {'Error': 'Could not find the check on the user\'s object, so could not remove it.'});
                      }
                    } else {
                      callback(500, {'Error': 'Could not find the user who created the check, so could not remove the check from the list of checks on their user object.'});
                    }
                  });
                } else {
                  callback(500, {'Error': 'Could not delete the check data.'});
                }
              });
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, {'Error': 'The check ID specified could not be found'});
        }
      });
    } else {
      callback(400, {'Error': 'Missing valid id'});
    }
  }
};

// Export checks controller modules
module.exports = _checks;
