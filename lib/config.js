/*
 * Create and export configuration variables
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Container for all environments
var environments = {
  // Local (default) environment
  local: {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'local',
    'hashingSecret': 'somethingThatIsSecret',
    'maxChecks': 5,
    'twilio': {
      'accountSid': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      'authToken': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      'fromPhone': '+12345678900'
    },
    'templateGlobals': {
      'appName': 'UptimeChecker',
      'companyName': 'NotARealCompany, Inc.',
      'yearCreated': '2018',
      'baseUrl': 'http://localhost:3000/'
    }
  },

  // Production environment
  production: {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'somethingThatIsAlsoASecret',
    'maxChecks': 10,
    'twilio': {
      'accountSid': '',
      'authToken': '',
      'fromPhone': ''
    },
    'templateGlobals': {
      'appName': 'UptimeChecker',
      'companyName': 'NotARealCompany, Inc.',
      'yearCreated': '2018'
    }
  }
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? 
  process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to local
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? 
  environments[currentEnvironment] : environments.local;

// Export the module
module.exports = environmentToExport;
