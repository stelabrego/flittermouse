.PHONY: clean db start lint test nodemon sass watch webpack

clean:
	rm -rf ./build
	mkdir build

db: clean
	sqlite3 build/eventz.db < create_database.sql

sass:
	sass --watch --no-source-map src/public/sass:build/public/css

nodemon:
	./node_modules/nodemon/bin/nodemon.js ./src/server.js

webpack:
	npx webpack --watch

lint:
	./node_modules/eslint/bin/eslint.js --fix src/

test:
	./node_modules/mocha/bin/mocha

watch: db nodemon sass webpack

start:
	${MAKE} -j watch