# Pinned to Node 16 (see README requirements), the image already includes Node
FROM nikolaik/python-nodejs:python3.10-nodejs16

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
