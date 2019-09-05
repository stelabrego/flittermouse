SHELL=/usr/local/bin/fish

.PHONY: clean db start lint test nodemon watch parcel

nodemon:
	npx nodemon --ignore src/public/ --ignore dist/ src/server.js

parcel:
	npx parcel watch src/public/**

lint:
	npx eslint --fix src/

test:
	npx mocha

watch: nodemon parcel

start:
	${MAKE} -j watch

# must install redis and start redis too