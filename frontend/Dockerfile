FROM node:10.16.3 as build-stage

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . .

# build app for production with minification
RUN npm run build


FROM nginx:1.14.0 as production-stage

RUN mkdir /app

COPY --from=build-stage /usr/src/app/frontend/dist /app

COPY nginx.conf /etc/nginx/nginx.conf