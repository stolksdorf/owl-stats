const Gist = require('./src/gist.api.js');



Gist.test()


exports.handler = (event, context, callback) => {
    // Succeed with the string "Hello world!"
    callback(null, 'Hello world!');
};