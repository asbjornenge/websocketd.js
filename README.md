# Websocketd.js

Shameless theft of the [websocketd](https://github.com/joewalnes/websocketd) idea, written in javascript & compiled with [nexe](https://github.com/crcn/nexe).

I needed some looser security. Didn't want to wait. Didn't want to write any Go. And it's like 20 lines of code... It only handles the STDOUT part for now, since I only needed to tail some logfiles.

## Build

	docker run -v $(pwd):/app -w /app asbjornenge/nexe-docker -o websocketdjs

## Run

	tail -f file.log | websocketdjs

enjoy.