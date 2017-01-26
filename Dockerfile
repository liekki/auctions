FROM node:6.9.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install -g yarn
RUN npm install -g nodemon
RUN yarn
COPY ./src /usr/src/app/src

COPY ./config.json /usr/src/app
COPY ./.babelrc /usr/src/app

EXPOSE 3002

CMD ["npm", "start"]
