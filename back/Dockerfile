FROM node:latest
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev libkrb5-dev
RUN mkdir /myapp
WORKDIR /myapp
ADD package.json /myapp/package.json
RUN npm install
ADD app.js /myapp
CMD ["node", "app.js"]
