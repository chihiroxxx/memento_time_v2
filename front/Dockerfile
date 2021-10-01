
FROM node:14.17.0




WORKDIR /usr/src/app

COPY ["package.json", "./"]

RUN npm install

COPY . .

RUN npm uninstall node-sass && npm install node-sass

