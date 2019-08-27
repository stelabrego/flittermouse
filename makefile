.PHONY: clean db start lint test server sass watch

clean:
	rm -rf ./build
	mkdir build

db: clean
	sqlite3 build/eventz.db < create_database.sql

sass:
	sass --watch --no-source-map src/public/sass:src/public/css

server:
	./node_modules/nodemon/bin/nodemon.js ./src/server.js

lint:
	./node_modules/eslint/bin/eslint.js --fix src/

test:
	./node_modules/mocha/bin/mocha

watch: db server sass

start:
	${MAKE} -j watch