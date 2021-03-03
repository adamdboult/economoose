FROM node:10
RUN apt-get update && apt-get -y install build-essential apache2 git python3

# Needed for the empty folder stuff to work
WORKDIR /Projects/economoose/

COPY . .
RUN npm install && npx gulp
CMD [ "node", "server.js", "80", "economoose_mongo", "27017" ]
