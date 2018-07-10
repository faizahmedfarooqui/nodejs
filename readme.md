#### This repo is under construction!

# Implementing NodeJS without using NPM

### What is it?

A Boilerplate built in NodeJS without using NPM

### What is needed?

NodeJS (LTS) ie. >= 8.11.3

### How to download & setup?

```sh
# Clone this repo using your terminal
git clone https://github.com/faizahmedfarooqui/nodejs.git;

# Go inside the repo
cd nodejs;

# Make a data directory into the root of the project
mkdir .data;

# Make a logs directory into the root of the project
mkdir logs;

# Goto the https directory
cd https;

# Now run the command given in the file keyGeneration.txt
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

### List of things, this repository contains:

#### 1. RESTful API:
* A server to listen to HTTP/HTTPS requests ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/server.js#L26-#L38))
* RESTful API to CRUD and many more for users, tokens & checks ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/handlers.js#L65-#L118))
* Router for request methods like GET, POST, PUT & DELETE ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/router.js))
* Handlers(ie. controllers) to handle requests & their methods ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/handlers.js))
* Model Base class ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/data.js))

#### 2. Workers:
* A Worker to execute things in background ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/workers.js))

#### 3. Logging:
* A logging logic that logs everything into a *.log file ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/logs.js))

#### 4. Compress & Decompress:
* A gzip compression logic which compresses older log file ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/logs.js#L69-#L110))

#### 3. Debugging:
* Local debug environment for the developments in each files ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/server.js#L15))

#### 4. Web App to serve routes & templates:
* A Web App with template logic & data interpolation ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/helpers.js#L116-#L182))

#### 5. Web App to serve static assets:
* Logic to serve static assets to the web-app ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/helpers.js#L184-#L199))
* Web routes handler for serving pages & static assets ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/handlers.js#L28-#L63))

#### 6. CLI Tool with Input handlers & their responders:
* The CLI tool that runs using node's readline, events libraries & many more ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/cli.js))
* CLI Events handlers ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/cli-handlers.js))
* CLI Events responders ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/cli-responders.js))

#### 7. Handling error crash:
* Server request are handled using try-catch block & now rather than app crash send 500 error response ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/server.js#L88-#L99))

#### 8. Debugger Mode:
* For detailed information please use official NodeJS [Documentation](https://nodejs.org/api/debugger.html)
* To run this app in debugger mode use command `node inspect index-debug.js`

