/*
 * Primary file for Clustered API Server
 * 
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

const cluster = require('cluster');
const os = require('os');

// Declare the app
var app = {};

// Init function
app.init = () => {
	// If we're on the master thread, start Workers & CLI
	if (cluster.isMaster) {
		// Start the workers
		workers.init();

		// Start the CLI, but make sure it starts last
		setTimeout(() => {
			cli.init();
		}, 500);

		// Fork the process, the number of times we have CPUs available
		for (var i = 0; i < os.cpus().length; i++) {
			cluster.fork();
		}

	} else {
		// If we're not on the master thread, Start the server
		server.init();
	}
};

// Self executing
app.init();

// Export the app
module.exports = app;
