/*
 * Example UDP Client
 * Sending a message to a UDP server on port 6000
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const dgram = require('dgram');

// Create the client
const client = dgram.createSocket('udp4');

// Define the message and pull it into a buffer
var messageString = 'This is a message';
var messageBuffer = Buffer.from(messageString);

// Send the message
client.send(messageBuffer, 6000, 'localhost', (err) => {
  	client.close();
});
