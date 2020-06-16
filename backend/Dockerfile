FROM node:10.16.3

WORKDIR /usr/src/app/backend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 4010

CMD [ "npm","start" ]