/**
 * CLI Input Hanlders
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Export CLI Input Handlers
module.exports = (e, cli) => {
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
};