FROM ubuntu:22.04

RUN apt-get -yqq update
RUN apt-get install -yq curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -yq nodejs

ADD . /opt/app
WORKDIR /opt/app

RUN npm install

EXPOSE 5000

CMD [ "npm", "start" ]