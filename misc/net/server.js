/*
 * Example TCP (Net) Server
 * Listens to port 6000 and sends the word "pong" to clients
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const net = require('net');

// Create the server
const server = net.createServer((connection) => {
   	// Send the word "pong"
   	var outboundMessage = 'pong';
   	connection.write(outboundMessage);

   	// When the client writes something, log it out
	connection.on('data', (inboundMessage) => {
      	var messageString = inboundMessage.toString();
      	console.log("I wrote "+outboundMessage+" and they said "+messageString);
    });
});

// Listen
server.listen(6000);
