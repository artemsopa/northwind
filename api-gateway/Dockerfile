FROM node:18-alpine

ADD . /opt/app
WORKDIR /opt/app

RUN npm install

EXPOSE 8000

CMD [ "npm", "start" ]