FROM node:18-alpine

ADD . /opt/app
WORKDIR /opt/app

RUN npm install

EXPOSE 8004

CMD [ "npm", "start" ]