FROM node:lts-alpine
RUN npm install -g http-server
COPY . /app
WORKDIR /app
EXPOSE 8080
CMD [ "http-server" ]
