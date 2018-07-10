/*
 * Example UDP Server
 * Creating a UDP datagram server and listening on 6000
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const dgram = require('dgram');

// Create the server
const server = dgram.createSocket('udp4');

server.on('message', (messageBuffer, sender) => {
  	// Do something with an incoming message or the sender
  	var messageString = messageBuffer.toString();
  	console.log(messageString);
});

// Bind to 6000
server.bind(6000);
