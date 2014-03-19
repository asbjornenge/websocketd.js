# Websocketd.js

Shameless theft of the [websocketd](https://github.com/joewalnes/websocketd) idea, written in javascript & compiled with [nexe](https://github.com/crcn/nexe).

Why? I needed some looser security. Didn't want to wait. Didn't want to write any Go. And it's like 50 lines of code... Prolly don't handle most edges :-P Please PR.

## How it works

It works very similar to websocketd. For each new established connection it will spawn a child of the supplied process. Any **stdout** and **stderr** from that child will be sendt to the connecting client. And any data sendt from the client will be piped to **stdin** of the child process.

## Build binary (optional)

	docker run -v $(pwd):/app -w /app asbjornenge/nexe-docker -o websocketdjs

## Run

	(bin) > ./websocketdjs --port 8080 ./echo.sh
	(joe) > node index.js --port 8080 ./echo.sh

## Connect

	var ws = new WebSocket('ws://localhost:8080/')
	ws.onmessage = function(event) { console.log(event.data); }
	ws.send('boofar\n')
	// --> boofar	

enjoy.