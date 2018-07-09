/**
 * CLI-related tasks
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const readline = require('readline');
const os = require('os');
const v8 = require('v8');

const util = require('util');
const debug = util.debuglog('cli');

const events = require('events');
class _events extends events{};
const e = new _events();

// Instantiate the cli module object
var cli = {};

// Input handlers
e.on('man', (str) => {
  cli.responders.help();
});

e.on('help', (str) => {
  cli.responders.help();
});

e.on('exit', (str) => {
  cli.responders.exit();
});

e.on('stats', (str) => {
  cli.responders.stats();
});

e.on('list users', (str) => {
  cli.responders.listUsers();
});

e.on('more user info', (str) => {
  cli.responders.moreUserInfo(str);
});

e.on('list checks', (str) => {
  cli.responders.listChecks(str);
});

e.on('more check info', (str) => {
  cli.responders.moreCheckInfo(str);
});

e.on('list logs', () => {
  cli.responders.listLogs();
});

e.on('more log info', (str) => {
  cli.responders.moreLogInfo(str);
});

// Responder objects
cli.responders = {};

// Help / Man
cli.responders.help = () => {
  	// Codify the commands and their explanations
  	var commands = {
		'exit': 'Kill the CLI (and the rest of the application)',
		'man': 'Show this help page',
		'help': 'Alias of the "man" command',
		'stats': 'Get statistics on the underlying operating system and resource utilization',
		'List users': 'Show a list of all the registered (undeleted) users in the system',
		'More user info --{userId}': 'Show details of a specified user',
		'List checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
		'More check info --{checkId}': 'Show details of a specified check',
		'List logs': 'Show a list of all the log files available to be read (compressed and uncompressed)',
		'More log info --{fileName}': 'Show details of a specified log file',
  	};

  	// Show the header for the help page that is as wide as the screen
  	cli.horizontalLine();
  	cli.centered('CLI Manual');
  	cli.horizontalLine();
  	cli.verticalSpace(2);

  	// Show each command, followed its description
  	for (var key in commands) {
  		if (commands.hasOwnProperty(key)) {
  			var value = commands[key];
  			var line = '      \x1b[33m '+key+'      \x1b[0m';
  			var padding = 60 - line.length;
  			
  			for (i = 0; i < padding; i++) {
  			    line += ' ';
  			}
  			line += value;

  			console.log(line);
  			cli.verticalSpace();
  		}
  	}
};

// Exit
cli.responders.exit = () => {
  process.exit(0);
};

// Stats
cli.responders.stats = () => {
  	// Compile an object of stats
  	var stats = {
	  	'Load Average': os.loadavg().join(' '),
	  	'CPU Count': os.cpus().length,
	  	'Free Memory': os.freemem(),
	  	'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
	  	'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
	  	'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
	  	'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
	  	'Uptime': os.uptime()+' Seconds'
  	};

  	// Show the header for the stats page that is as wide as the screen
  	cli.horizontalLine();
  	cli.centered('System Statistics');
  	cli.horizontalLine();
  	cli.verticalSpace(2);

  	// Log each of the stats
  	for (var key in stats) {
  		if (stats.hasOwnProperty(key)) {
  			var value = stats[key];
  			var line = '      \x1b[33m '+key+'      \x1b[0m';
  			var padding = 60 - line.length;
  			
  			for (i = 0; i < padding; i++) {
  			    line += ' ';
  			}
  			line += value;

  			console.log(line);
  			cli.verticalSpace();
  		}
  	}

  	// Create a footer for the stats
  	cli.verticalSpace();
  	cli.horizontalLine();
};

// List Users
cli.responders.listUsers = () => {
  console.log('You asked to list users');
};

// More user info
cli.responders.moreUserInfo = (str) => {
  console.log('You asked for more user info', str);
};

// List Checks
cli.responders.listChecks = () => {
  console.log('You asked to list checks');
};

// More check info
cli.responders.moreCheckInfo = (str) => {
  console.log('You asked for more check info', str);
};

// List Logs
cli.responders.listLogs = () => {
  console.log('You asked to list logs');
};

// More logs info
cli.responders.moreLogInfo = (str) => {
  console.log('You asked for more log info', str);
};

// Create a veritical space
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
