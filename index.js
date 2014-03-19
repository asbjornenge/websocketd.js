/** websocketd.js
 *
 * STDOUT into a websocket server
 *
 */

var _     = require('lodash')
var ws    = require('nodejs-websocket')
var argv  = require('optimist').argv
var spawn = require('child_process').spawn

var default_config = {
    port : null,
    host : '0.0.0.0'
}

var config    = _.merge(_.clone(default_config, true), argv)
var proc      = _.reduce(process.argv, function(was, key) {
    if (key === config._[0]) this.cmd = true
    return this.cmd ? was.concat(key) : was
},[])

var server = ws.createServer(function (conn) {
    console.log("New connection")

    conn.proc = spawn(proc[0],proc.slice(1))
    conn.proc.stdout.on('data', function (data) {
        conn.sendText(data)
    });
    conn.proc.stderr.on('data', function (data) {
        conn.sendText(data)
    });
    conn.proc.on('error', function(err) {
        console.log("ERROR: "+err)
        conn.proc = null
    })

    conn.on("text", function(data) {
        if (!conn.proc) return
        try { conn.proc.stdin.write(data) }
        catch (err) { console.log('ERROR: '+err); conn.sendText('ERROR: '+err); conn.proc = null }
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        if (!conn.proc) return
        conn.proc.kill('SIGHUP')
    })
    conn.on("error", function(err) {
        console.log("Error",err)
        if (!conn.proc) return
        conn.proc.kill('SIGHUP')
    })
}).listen(config.port, config.host, function() {
    console.log('Broadcasting @',this.socket.address())
})