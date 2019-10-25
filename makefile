.PHONY: clean db start lint test nodemon watch parcel

nodemon:
	npx nodemon --ignore src/public/ --ignore dist/ src/server.js

parcel:
	npx parcel watch --no-source-maps --target browser src/public/stylesheets/* src/public/scripts/* src/public/images/*

lint:
	npx eslint --fix src/

test:
	npx mocha

db:
	docker-compose stop db adminer
	docker-compose rm --force db adminer
	docker-compose start db adminer

rm-containers:
	docker-compose down --remove-orphans

watch: nodemon parcel

start:
	${MAKE} -j watch

prod:
	docker-compose down --remove-orphans
	docker-compose up -d --force-recreate

# must install redis and start redis too
# chrome does a weird asset reload when it notices it got changed on the server
# which triggers db queries out of nowhere
# i think there's a bug with the url of the parcel css sourcemaps
# there is https://github.com/parcel-bundler/parcel/pull/2867
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04
# install latest docker-compose release https://github.com/docker/compose/releases
# don't use snap install docker! it runs docker in a container and you can't access env variables