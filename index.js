var ws = require('nodejs-websocket')

var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8080)

server.broadcast = function(data) {
    for(var i in this.connections)
        this.connections[i].sendText(data);
}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function(chunk) {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    server.broadcast(chunk)
    process.stdout.write('data: ' + chunk);
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});