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
  debugger;
  server.init();
  debugger;

  // Start the workers
  debugger;
  workers.init();
  debugger;

  // Start the CLI, but make sure it starts last
  debugger;
  setTimeout(() => {
  	cli.init();
  	debugger;
  }, 500);
  debugger;
};

// Self executing
app.init();

// Export the app
module.exports = app;
