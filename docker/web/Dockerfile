FROM node:16
RUN apt-get update && apt-get -y install \
  build-essential                        \
  python3                                #\
#  apache2                                \
#  git                                    \
#  ruby-sass

# Needed for the empty folder stuff to work
WORKDIR /Projects/economoose/

COPY . .
RUN pip3 install -r requirements.txt

RUN npm ci && make
CMD [ "node", "server.js", "80", "economoose-mongo", "27017" ]
