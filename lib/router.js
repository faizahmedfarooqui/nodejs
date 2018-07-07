/**
 * Router holds all the routes
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const handlers = require('./handlers');

// Define the router
var router = {};

// Define the routes & their handlers into the router
router = {
  '': handlers.index,
  
  'account/create': handlers.accountCreate,
  'account/edit': handlers.accountEdit,
  'account/deleted': handlers.accountDeleted,

  'session/create': handlers.sessionCreate,
  'session/deleted': handlers.sessionDeleted,

  'checks/all': handlers.checksList,
  'checks/create': handlers.checksCreate,
  'checks/edit': handlers.checksEdit,
  
  'ping': handlers.ping,

  'api/users': handlers.users,
  'api/tokens': handlers.tokens,
  'api/checks': handlers.checks,

  'favicon.ico': handlers.favicon,
  'public': handlers.public
};


// Export the router module
module.exports = router;