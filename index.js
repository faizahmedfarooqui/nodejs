/*
 * Primary file for API Server
 * 
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

// Declare the app
var app = {};

// Init function
app.init = () => {

  // Start the server
  server.init();

  // Start the workers
  workers.init();

  // Start the CLI, but make sure it starts last
  setTimeout(() => {
  	cli.init();
  }, 500);
};

// Self executing
app.init();

// Export the app
module.exports = app;
