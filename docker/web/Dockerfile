FROM node:22
RUN apt-get update && apt-get install --no-install-recommends --yes \
  build-essential                                                   \
  python3                                                           \
  python3-venv                                                      \
  python3-dev                                                       \
  python3-pip                                                       \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Needed for the empty folder stuff to work
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./
# Install dependencies using npm ci
RUN npm ci

ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
#RUN pip3 install -r requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --disable-pip-version-check --no-cache-dir -r requirements.txt

# Ensure the virtual environment is activated for future commands
ENV PATH="/opt/venv/bin:$PATH"

COPY . .

RUN make

CMD [ "node", "server.js", "80", "economoose-mongo", "27017" ]
