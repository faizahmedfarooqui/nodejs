/**
 * Controller for Index Page
 *
 * @author Faiz A Farooqui <faiz@geekyants.com>
 */

// Dependencies
const helpers = require('./../../../lib/helpers');

var index = (data, callback) => {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Uptime Monitoring - GeekyAnts',
      'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
      'body.class': 'index'
    };

    // Read in a template as a string
    helpers.getTemplate('index', templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};


// Export index controller modules
module.exports = index;