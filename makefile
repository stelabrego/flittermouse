.PHONY: clean db start lint test nodemon sass watch webpack

clean:
	rm -rf ./build
	mkdir build
	mkdir build/public
	cp -R ./src/public/images ./build/public

db:
	sqlite3 build/eventz.db < create_database.sql

sass:
	sass --watch --no-source-map src/public/sass:build/public/css

nodemon:
	npx nodemon ./src/server.js

webpack:
	npx webpack --watch

lint:
	npx eslint --fix src/

test:
	npmx mocha

watch: db nodemon sass webpack

start: clean
	${MAKE} -j watch