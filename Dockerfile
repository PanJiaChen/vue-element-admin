FROM node:alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package.json /app
RUN npm install
COPY . /app

CMD npm run docker:serve

#Node Application Port
EXPOSE 8080