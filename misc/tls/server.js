/*
 * Example TLS Server
 * Listens to port 6000 and sends the word "pong" to clients
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Server options
const options = {
    key: fs.readFileSync(path.join(__dirname, '/../../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/../../https/cert.pem'))
};

// Create the server
const server = tls.createServer(options, (connection) => {
    // Send the word "pong"
    var outboundMessage = 'pong';
    connection.write(outboundMessage);

    // When the client writes something, log it out
    connection.on('data', (inboundMessage) => {
        var messageString = inboundMessage.toString();
        console.log("I wrote " + outboundMessage + " and they said " + messageString);
    });
});

// Listen
server.listen(6000);
