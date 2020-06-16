FROM node:10.16.3

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /usr/src/app/frontend

COPY package.json ./

RUN npm install

COPY . .

# build app for production with minification
RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist" ]