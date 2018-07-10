/*
 * Example VM
 * Running some arbitrary commmands that can be used in CI/CD
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const vm = require('vm');

// Define a context for the script to run in
var context = {
	foo: 25
};

// Define the script
const script = new vm.Script(`
	foo = foo * 2;
  	var bar = foo + 1;
  	var fizz = 52;
`);

// Run the script
script.runInNewContext(context);

console.log(context);
