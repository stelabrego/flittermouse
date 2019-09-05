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
# chrome does a weird asset reload when it notices it got changed on the server
# which triggers db queries out of nowhere
# i think there's a bug with the url of the parcel css sourcemaps
# there is https://github.com/parcel-bundler/parcel/pull/2867