/*
 * Example HTTP2 Server
 * Opening a full-duplex (stream) channel on port 6000
 * 
 * @author Faiz A Farooqui <faiz@geekyants.com>
 */

// Dependencies
const http2 = require('http2');

// Init the server 
// Note: We can also make it secured using Node API http2.createSecureServer() but
// you need to pass key.pem / cert.pem files as key / cert index into the createSecureServer()
const server = http2.createServer();

// On a stream, send back hello world html
server.on('stream', (stream, headers) => {
  	// Create the respond to the stream
  	stream.respond({
    	':status': 200,
    	'content-type': 'text/html'
  	});

  	// Send & end the stream respond
  	stream.end('<html><body><p>Hello World</p></body></html>');
});

// Listen on 6000
server.listen(6000);
