FROM node
WORKDIR /var/www/app
COPY ./ /var/www/app
RUN npm install
RUN npx parcel build src/public/stylesheets/* src/public/scripts/* src/public/images/*
CMD node src/server.js 