/**
 * CLI Responder modules
 *
 * @author Faiz A Farooqui <faiz@geekyants.com>
 */

// Dependenices
const os = require('os');
const v8 = require('v8');
const childProcess = require('child_process');

const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');

// Export the responders modules
module.exports = (cli) => {
	// Initialize responders
	var responders = {}

	// Help / Man
	responders.help = () => {
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
			'List logs': 'Show a list of all the log files available to be read (compressed only)',
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
	responders.exit = () => {
	  	process.exit(0);
	};

	// Stats
	responders.stats = () => {
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
	responders.listUsers = () => {
		_data.list('users', (err, userIds) => {
			if (!err && userIds && userIds.length > 0) {
				cli.verticalSpace();
				userIds.forEach((userId) => {
					_data.read('users', userId, (err, userData) => {
						var line = 'Name: '+userData.firstName + ' ' + userData.lastName + ' ' + userData.phone + ' Checks: ';
						var numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
						line += numberOfChecks;
						console.log(line);
						cli.verticalSpace();
					});
				});
			}
		});
	};

	// More user info
	responders.moreUserInfo = (str) => {
	  	// Get ID from string
	  	var arr = str.split('--');
	  	var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
	  	if (userId) {
	  		// Look for the user
	  		_data.read('users', userId, (err, userData) => {
	  			if (!err && userData) {
	  				// Remove hashed password
	  				delete userData.hashedPassword;

	  				// Print the JSON with text highligthing
	  				cli.verticalSpace();
	  				console.dir(userData, {colors: true});
	  				cli.verticalSpace();
	  			}
	  		});
	  	}
	};

	// List Checks
	responders.listChecks = (str) => {
	  _data.list('checks', (err, checkIds) => {  	
	  	if (!err && checkIds && checkIds.length > 0) {
	  		cli.verticalSpace();
	  		checkIds.forEach((checkId) => {
	  			_data.read('checks', checkId, (err, checkData) => {
	  				if (!err && checkData) {
		  				var includeCheck = false;
		  				var lowerString = str.toLowerCase();

		  				// Get the state, default to down
		  				var state = typeof(checkData.state) == 'string' ? checkData.string : 'down';
		  				// Get the state, default to down
		  				var stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';
		  				// If the user has specified, or has not specified any state, include the check accordingly
		  				if (str.toLowerCase().indexOf('--'+state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)) {
		  					var line = 'ID: ' + checkData.id + ' ' + checkData.method.toUpperCase() + ' ' + checkData.protocol + '://' + checkData.url + ' State: ' + stateOrUnknown;
		  					console.log(line);
		  					cli.verticalSpace();
		  				}
	  				}
	  			});
	  		});
	  	}
	  });
	};

	// More check info
	responders.moreCheckInfo = (str) => {
		// Get ID from string
		var arr = str.split('--');
		var checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
		if (checkId) {
	    	// Lookup the check
			_data.read('checks', checkId, (err, checkData) => {
	      		if (!err && checkData) {

					// Print their JSON object with text highlighting
					cli.verticalSpace();
					console.dir(checkData, {colors: true});
					cli.verticalSpace();
		      	}
	    	});
	  	}
	};

	// List Logs
	responders.listLogs = () => {
		// Using logs model....
		// _logs.list(true, (err, logFileNames) => {
		//    	if (!err && logFileNames && logFileNames.length > 0) {
		//      	cli.verticalSpace();
		//  		logFileNames.forEach((logFileName) => {
		//        		if (logFileName.indexOf('-') > -1) {
		//          		console.log(logFileName);
		//          		cli.verticalSpace();
		//    			}
		//      	});
		// 		}
		//  });
		
		//  Using Child Process Module
		var ls = childProcess.spawn('ls', ['./.logs']);
		ls.stdout.on('data', (dataObj) => {
			// Explode into separate lines
			var dataStr = dataObj.toString();
			var logFileNames = dataStr.split('\n');
     		cli.verticalSpace();
 			logFileNames.forEach((logFileName) => {
	       		if (typeof(logFileName) == 'string' && logFileName.length > 0 && logFileName.indexOf('-') > -1) {
	     			console.log(logFileName.trim().split('.')[0]);
	     			cli.verticalSpace();
	   			}
     		});
		});
	};

	// More logs info
	responders.moreLogInfo = (str) => {
		// Get logFileName from string
		var arr = str.split('--');
		var logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
		if (logFileName) {
	    	cli.verticalSpace();
	    	// Decompress it & get string data
	    	_logs.decompress(logFileName, (err, strData) => {
	      		if (!err && strData) {
	    			// Split it into lines
	        		var arr = strData.split('\n');
	        		arr.forEach((jsonString) => {
	          			var logObject = helpers.parseJsonToObject(jsonString);
	          			if (logObject && JSON.stringify(logObject) !== '{}') {
	            			console.dir(logObject, {colors: true});
	            			cli.verticalSpace();
	          			}
	        		});
	      		}
	    	});
	  	}
	};

	return responders;
};
