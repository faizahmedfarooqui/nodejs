/*
 * Async Hooks Example
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

// Dependencies
const async_hooks = require('async_hooks');
const fs = require('fs');

// Target execution context
var targetExecutionContext = false;

// Write an arbitrary async function
const whatTimeIsIt = (callback) => {
    setInterval(() => {
        fs.writeSync(1, 'When the setInterval runs, the execution context is ' + async_hooks.executionAsyncId() + '\n');
        callback(Date.now());
    }, 1000);
};

// Call that function
whatTimeIsIt((time) => {
    fs.writeSync(1, 'The time is ' + time + '\n');
});

// Hooks
var hooks = {
    init: (asyncId, type, triggerAsyncId, resource) => {
        fs.writeSync(1, 'Hook init ' + asyncId + '\n');
    },
    before: (asyncId) => {
        fs.writeSync(1, 'Hook before ' + asyncId + '\n');
    },
    after: (asyncId) => {
        fs.writeSync(1, 'Hook after ' + asyncId + '\n');
    },
    destroy: (asyncId) => {
        fs.writeSync(1, 'Hook destroy ' + asyncId + '\n');
    },
    promiseResolve: (asyncId) => {
        fs.writeSync(1, 'Hook promiseResolve. ' + asyncId + ' This isn\'t applicable to our context, and should never get called here\n');
    }
};

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook =  async_hooks.createHook(hooks);
asyncHook.enable();
