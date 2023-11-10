/**
 * Adapted from the sample function found here:
 * https://github.com/digitalocean/sample-functions-nodejs-helloworld/blob/master/packages/sample/hello/hello.js
 *
 * @param args
    * @returns {{body: string}}
 */
function main(args) {
    let name = args.name || process.env.NAME
    let greeting = 'Hello ' + name + '!'
    return {"body": greeting}
}

// Note use of global due to inclusion of webpack
global.main = main
