/*
 * node-ws - pure Javascript WebSockets server
 * Copyright Bradley Wright <brad@intranation.com>
 */

// Use strict compilation rules - we're not animals
'use strict';

var net = require('net'),
    crypto = require('crypto');

function bigEndian(value) {
    var result = [
        String.fromCharCode(value >> 24 & 0xFF),
        String.fromCharCode(value >> 16 & 0xFF),
        String.fromCharCode(value >> 8 & 0xFF),
        String.fromCharCode(value & 0xFF)
    ];
    return result.join('');
}

function computeKey(key) {
    /*
     * For each of these fields, the server has to
     * take the digits from the value to obtain a
     * number, then divide that number by the number
     * of spaces characters in the value to obtain
     * a 32-bit number.
     */
    var length = parseInt(key.match(/\s/g).length),
        chars = parseInt(key.replace(/[^0-9]/g, ''));
    return (chars / length);
}

function test() {
        key2 = computeKey(headers['sec-websocket-key2']),
        /*
         * The third piece of information is given
         * after the fields, in the last eight
         * bytes of the handshake, expressed here
         * as they would be seen if interpreted as ASCII
         */
        data = request.slice(-8, request.length),
        // md5 hhash
        hash = crypto.createHash('md5');
    // update hash with all values
    hash.update(bigEndian(key1));
    hash.update(bigEndian(key2));
    hash.update(data);
}



// protocol 13
// http://tools.ietf.org/html/draft-ietf-hybi-thewebsocketprotocol-13
function HandshakeHYBI00(request) {
    // split up lines and parse
    var lines = request.split('\r\n'),
        headers = parseHeaders(lines);
        console.log(lines, headers)
    if ('sec-websocket-key') {
        console.log('HER')
        var key = headers['sec-websocket-key']+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

        console.log(key)

        return false;

        // TODO: make this a template maybe
        var response = [
            'HTTP/1.1 101 WebSocket Protocol Handshake',
            'Upgrade: WebSocket',
            'Connection: Upgrade',
            'Sec-WebSocket-Origin: ' + headers['origin'],
            // TODO: ws or wss
            // TODO: add actual request path
            'Sec-Websocket-Accept: ' + hash,
            'Sec-WebSocket-Location: ws://' + headers['host'] + '/',
            '',
            hash.digest('binary')
        ];
        return response;
    }
    return false;
}

function parseHeaders(headers) {
    // splits a list of headers into key/value pairs
    var parsedHeaders = {};

    headers.forEach(function(header) {
        // might contain a colon, so limit split
        var toParse = header.split(':');
        if (toParse.length >= 2) {
            // it has to be Key: Value
            var key = toParse[0].toLowerCase(),
                // might be more than 1 colon
                value = toParse.slice(1).join(':')
                    .replace(/^\s\s*/, '')
                    .replace(/\s\s*$/, '');
            parsedHeaders[key] = value;
        }
        else {
            // it might be a method request,
            // which we want to store and check
            if (header.indexOf('GET') === 0) {
                parsedHeaders['X-Request-Method'] = 'GET';
            }
        }
    });

    return parsedHeaders;
}

var WebsocketServer = net.createServer(function (socket) {
    // listen for connections
    var wsConnected = false;

    socket.addListener('data', function (data) {
        // are we connected?
        if (wsConnected) {
            console.log(data.toString('utf8'));
        }
        else {
            var response = HandshakeHYBI00(data.toString('binary'));
            console.log(response)
            if (response) {
                // handshake succeeded, open connection
                socket.write(response.join('\r\n'), 'binary');
                wsConnected = true;
            }
            else {
                // close connection, handshake bad
                socket.end();
                return;
            }
        }
    });

});

WebsocketServer.listen(8080, "0.0.0.0");