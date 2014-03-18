# Websocketd.js

Shameless clone of [websocketd](https://github.com/joewalnes/websocketd) written in javascript & compiled with [nexe](https://github.com/crcn/nexe).

Mostly cause I needed a *"missing feature"* (less security) in websocketd. Didn't want to wait. Didn't want to write any Go. And it's like 20 lines of code...

## Build

	docker run -v $(pwd):/app -w /app asbjornenge/nexe-docker -o websocketd.js

## Run

	tail -f file.log | websocketd.js

enjoy.