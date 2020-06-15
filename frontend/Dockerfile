FROM node:10.16.3

WORKDIR /usr/src/app/frontend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]