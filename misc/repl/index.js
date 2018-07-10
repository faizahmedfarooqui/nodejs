/*
 * Example REPL server
 * Take in the word "fizz" and log out "buzz"
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const repl = require('repl');

// Start the REPL
repl.start({
  	prompt: '>',
  	eval: (str) => {
	    // Evaluation function for incoming inputs
	    console.log('AT THE EVAL', str);

	    // If the user said 'fizz', say 'buzz' back to them
	    if (str.indexOf('fizz') > -1) {
	      	console.log('buzz');
		}
  	}
});
