compile:
	./node_modules/@babel/cli/bin/babel.js --watch --out-dir build --copy-files ./src &

run:
	./node_modules/nodemon/bin/nodemon.js ./build/server.js

db:
	sqlite3 build/eventz.db < create_database.sql

lint:
	./node_modules/eslint/bin/eslint.js --fix src/

all: compile db run