.PHONY: clean db build start lint test

clean:
	rm -rf ./build
	mkdir build

db:
	sqlite3 build/eventz.db < create_database.sql

build: clean db
	./node_modules/@babel/cli/bin/babel.js --watch --out-dir ./build --copy-files ./src

start:
	./node_modules/nodemon/bin/nodemon.js ./build/server.js

lint:
	./node_modules/eslint/bin/eslint.js --fix src/

test: db
	./node_modules/mocha/bin/mocha