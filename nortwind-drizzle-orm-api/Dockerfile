# start from base
FROM ubuntu:22.04

# install system-wide deps for node
RUN apt-get -yqq update
RUN apt-get install -yq curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -yq nodejs

# get versions
RUN node -v
RUN npm -v

# copy our application code
ADD . /opt/app
WORKDIR /opt/app

# fetch app specific deps
RUN npm install
RUN npm run build

# expose port
EXPOSE 5000

# start app
CMD [ "node", "./build/index.js" ]