FROM nikolaik/python-nodejs:latest

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -

RUN mkdir /app
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn config set network-timeout 300000
RUN yarn install

# 'build' is a custom Node.js script defined in package.json
ENTRYPOINT [ "yarn" ]
CMD [ "build" ]

COPY . /app
