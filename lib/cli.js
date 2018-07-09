/**
 * CLI-related tasks
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const readline = require('readline');

const util = require('util');
const debug = util.debuglog('cli');

const events = require('events');
class _events extends events{};
const e = new _events();

// Instantiate the cli module object
var cli = {};

// Create a vertical space
cli.verticalSpace = (lines) => {
	lines = typeof(lines) == 'number' && lines > 0 ? lines : 0;

	for (var i = 0; i < lines; i++) {
		console.log('');
	}
};

// Create a horizontal line
cli.horizontalLine = () => {
	// Get the available screen size
	var width = process.stdout.columns;

	var lines = '';
	for (var i = 0; i < width; i++) {
		lines += '-';
	}

	console.log(lines);
};

// Create centered text on the screen
cli.centered = (str) => {
	str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

	// Get the available screen size
	var width = process.stdout.columns;

	// Calculate the left padding there should be
	var leftPadding = Math.floor((width - str.length) / 2);

	// Put in lefy padded spaces before the string itself
	var line = '';
	for (var i = 0; i< leftPadding; i++) {
		line += ' ';
	}
	line += str;

	console.log(line);
};

// Input processot=r
cli.processInput = (str) => {
	str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
	// Only process the input if the user actually wrote something, otherwise ignore it
	if (str) {
	  	// Codify the unique strings that identify the different unique questions allowed be to asked
	  	var uniqueInputs = [
			'man',
			'help',
			'exit',
			'stats',
			'list users',
			'more user info',
			'list checks',
			'more check info',
			'list logs',
			'more log info'
	  	];

	  	// Go through the possible inputs, emit event when a match is found
	  	var matchFound = false;
		var counter = 0;
		uniqueInputs.some((input) => {
	    	if (str.toLowerCase().indexOf(input) > -1) {
	      		matchFound = true;
	      		// Emit event matching the unique input, and include the full string given
	      		e.emit(input, str);
	      		return true;
    		}
	  	});

	  	// If no match is found, tell the user to try again
	  	if (! matchFound) {
	    	console.log('Sorry, try again');
	  	}
	}
};

// Import Responder objects
cli.responders = require('./cli-responders')(cli);

// Import Input handlers
require('./cli-handlers')(e, cli);

// Init script
cli.init = () => {
	// Send to console, in dark blue
	console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

	// Start the interface
	var _interface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: ''
	});

	// Create an initial prompt
	_interface.prompt();

	// Handle each line of input separately
	_interface.on('line', (str) => {
		// Send to the input processor
		cli.processInput(str);

		// Re-initialize the prompt afterwards
		_interface.prompt();
	});

	// If the user stops the CLI, kill the associated process
	_interface.on('close', () => {
  		process.exit(0);
	});
};

// Export CLI modules
module.exports = cli;
