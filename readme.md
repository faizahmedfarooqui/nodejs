# Implementing NodeJS without using NPM

### What is it?

A boilerplate or a sample built in **NodeJS** without using **NPM** covering all (or most) of the Node's API modules

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
* A server to listen to HTTP/HTTPS requests ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/server.js#L26-#L39))
* Deflate / GZIP Compression for HTTP/HTTPS created servers but with logic to check for header's 'ACCEPT_ENCODING' before the compression ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/server.js#L151-#L179))
* RESTful API to CRUD and many more for users, tokens & checks ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/handlers.js#L65-#124))
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
* Local debug environment for the developments in each files ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/server.js#L15-#L16))

#### 4. Web App to serve routes & templates:
* A Web App with template logic & data interpolation ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/helpers.js#L116-#L182))

#### 5. Web App to serve static assets:
* Logic to serve static assets to the web-app ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/helpers.js#L184-#L199))
* Web routes handler for serving pages & static assets ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/handlers.js#L28-#L63))

#### 6. CLI Tool with Input handlers & their responders:
* The CLI tool that runs using node's readline, events libraries & many more ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/cli.js))
* CLI Events handlers ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/cli-handlers.js))
* CLI Events responders ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/cli-responders.js))

```sh
---------------------------------------------------------------------------------------------------------------------------------------------------------
                     CLI Manual
---------------------------------------------------------------------------------------------------------------------------------------------------------
exit                          Kill the CLI (and the rest of the application)
man                           Show this help page
help                          Alias of the "man" command
stats                         Get statistics on the underlying operating system and resource utilization
List users                    Show a list of all the registered (undeleted) users in the system
More user info --{userId}     Show details of a specified user
List checks --up --down       Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."
More check info --{checkId}   Show details of a specified check
List logs                     Show a list of all the log files available to be read (compressed only)
More log info --{fileName}    Show details of a specified log file
```

#### 7. Handling error crash:
* Server request are handled using try-catch block & now rather than app crash send 500 error response ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/server.js#L88-#L99))

#### 8. Debugger Mode:
* For detailed information please use official NodeJS [Documentation](https://nodejs.org/api/debugger.html)
* To run this app in debugger mode use command `node inspect index-debug.js`

#### 9. Performance Hooks:
* Added PerformanceObserver Node Class to observe all the entries & log them out to the CLI ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/https/controllers/api/tokens.js#L12-#L31))
* Added Performance Mark & Measure methods to measure all the marked performance steps ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/https/controllers/api/tokens.js#L38-#L75))
* To see how it works, run command `NODE_DEBUG=performance node index.js` in your terminal

#### 10. Cluster:
* Added a new file with clusters, here forks are created by the count of the cpus available ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/index-cluster.js))
* To see how it works, run command `node index-cluster.js` in your terminal

#### 11. Child Process:
* Using `ls` commands into the `.logs` folder from CLI commands `list logs` ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/lib/cli-responders.js#L209-#L222))

#### 12. Other NodeJS Modules:
* Use of Async Hooks module ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/misc/async-hooks/index.js))
* Use of HTTP/2 module in Client & Server Logic ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/misc/http2))
* Use of NET module in Client & Server Logic ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/misc/net))
* Use of REPL module ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/misc/repl/index.js))
* Use of TLS/SSL module in Client & Server Logic ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/misc/tls))
* Use of UDP module in Client & Server Logic ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/misc/udp))
* Use of VM module ([View Code](https://github.com/faizahmedfarooqui/nodejs/blob/master/misc/vm/index.js))

#### That's It!
