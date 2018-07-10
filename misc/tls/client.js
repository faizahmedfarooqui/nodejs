/*
 * Example TLS client (Subset of Node's NET Module but is ssl secured)
 * Connects to port 6000 and sends the word "ping" to servers
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Define the message to send
var outboundMessage = 'ping';

// Client options
var options = {
  	ca: [fs.readFileSync(path.join(__dirname, '/../../https/cert.pem'))] // Only required because we're using a self-signed cert)
};

// Create the client
const client = tls.connect(6000, options, () => {
  	// Send the message
  	client.write(outboundMessage);
});

// When the server writes back, log what it says then kill the client
client.on('data', (inboundMessage) => {
  	var messageString = inboundMessage.toString();
  	console.log("I wrote " + outboundMessage + " and they said " + messageString);
  	client.end();
});
