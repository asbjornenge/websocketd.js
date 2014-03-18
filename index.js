var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function(chunk) {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    wss.broadcast(chunk)
    process.stdout.write('data: ' + chunk);
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});