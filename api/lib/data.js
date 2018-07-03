/*
 * Library for storing and editing data
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const fs = require('fs');
const path = require('path');

const helpers = require('./helpers');

// Container for module (to be exported)
var lib = {
  // Base directory of data folder
  baseDir: path.join(__dirname,'/../.data/'),

  // Write data to a file
  create: (dir, file, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing new file');
              }
            });
          } else {
            callback('Error writing to new file');
          }
        });
      } else {
        callback('Could not create new file, it may already exist');
      }
    })
  },

  // Read data from a file
  read: (dir, file, callback) => {
    // Read the file from the given path in utf8 charset
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', (err, data) => {
      if (!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    });
  },

  // Update data in a file
  update: (dir,file,data,callback) => {
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor,function(err) {
          if (!err) {
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData,function(err) {
              if (!err) {
                fs.close(fileDescriptor,function(err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback('Error closing existing file');
                  }
                });
              } else {
                callback('Error writing to existing file');
              }
            });
          } else {
            callback('Error truncating file');
          }
        });
      } else {
        callback('Could not open file for updating, it may not exist yet');
      }
    })
  },

  // Delete a file
  delete: (dir, file, callback) => {
    // Unlink the file from the filesystem
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err) => {
      callback(err);
    });
  },

  // List all the items in a directory
  // [Note: This will be used in workers!]
  list: (dir, callback) => {
    fs.readdir(lib.baseDir+dir+'/', (err, data) => {
      if (!err && data && data.length > 0) {
        var trimmedFileNames = [];
        data.forEach((fileName) => {
          trimmedFileNames.push(fileName.replace('.json', ''));
        });
        callback(false, trimmedFileNames);
      } else {
        callback(err, data);
      }
    });
  }
};

// Export the module
module.exports = lib;
