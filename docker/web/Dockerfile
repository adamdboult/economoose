FROM node:22 AS node-build
RUN npm install -g npm@latest

WORKDIR /app

COPY package.json package-lock.json ./

# Setting NODE_ENV means the development packages get skipped
ENV NODE_ENV=production
RUN npm ci

#FROM python:3.11
FROM node:22

WORKDIR /app

# Copy Node.js dependencies from the build stage
#COPY --from=node-build /usr/local/lib/node_modules ./
COPY --from=node-build /app/node_modules ./node_modules

# Set up environment variables
#ENV PATH="/usr/local/lib/node_modules/.bin:$PATH"

RUN apt-get update && apt-get install --no-install-recommends --yes \
  python3.11                                                        \
  python3.11-venv                                                   \
  python3.11-dev                                                    \
  python3-pip                                                       \
  && apt-get clean                                                  \
  && rm -rf /var/lib/apt/lists/*                                    \
  && rm -rf /usr/share/doc/* /usr/share/man/*

COPY requirements.txt .
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --disable-pip-version-check --no-cache-dir --no-deps --require-hashes -r requirements.txt

# Ensure the virtual environment is activated for future commands
ENV PATH="/opt/venv/bin:$PATH"

COPY . .

RUN make

CMD [ "node", "server.js", "80", "economoose-mongo", "27017" ]

