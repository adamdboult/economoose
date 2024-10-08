FROM node:22
RUN apt-get update && apt-get -y install \
  build-essential                        \
  python3-full                           \
  python3-pip

# Needed for the empty folder stuff to work
WORKDIR /Projects/economoose/

COPY . .

#RUN pip3 install -r requirements.txt
RUN python3 -m venv /opt/venv \
    && . /opt/venv/bin/activate \
    && pip install --upgrade pip \
    && pip install -r requirements.txt

# Ensure the virtual environment is activated for future commands
ENV PATH="/opt/venv/bin:$PATH"

RUN npm ci && make

CMD [ "node", "server.js", "80", "economoose-mongo", "27017" ]
