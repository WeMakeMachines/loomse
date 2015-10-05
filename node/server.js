// todo - add collision detection for generated ids that are the same

var http = require('http'),
    express = require('express'),
    clients = [],
    pairings = [];

http.createServer(function (request, response) {
    var ip = request.connection.remoteAddress;
    var UUID = generateUUID();
    clients.push([UUID, ip, 'desktop']);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Welcome! Total clients: ' + clients);

}).listen(1337);

function generateUUID() {
    var id = random(1000000,9999999);
    return id;
};

function random(minRange,maxRange) {
    if(typeof minRange === 'undefined' ){
        var minRange = 0;
    }
    var range = maxRange - minRange;
    if(range <= 0){
        range = maxRange;
        minRange = 0;
    }
    // returns a random number between 1 and number
    var number = (Math.floor((Math.random() * range)) + minRange);
    return number;
};

console.log('Server running on port 1337');