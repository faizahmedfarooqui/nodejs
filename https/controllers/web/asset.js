/**
 * Controller for Asset Pages
 *
 * @author Faiz A Farooqui <faiz@geekyants.com>
 */

// Dependencies
const helpers = require('./../../../lib/helpers');

var asset = {};

// Favicon
asset.favicon = (data, callback) => {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', (err, data) => {
      if (!err && data) {
        // Callback the data
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Get public assets
asset.public = (data, callback) => {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Get the filename requested
    var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();    
    if (trimmedAssetName.length > 0) {
      // Read in the assets's data
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && data) {
          // Determine the content-type (default to plain text)
          var contentType = 'plain';

          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }

          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(500);
        }
      });
    } else {
      callback(405);
    }
  } else {
    callback(405);
  }
};

// Exports asset controller modules
module.exports = asset;