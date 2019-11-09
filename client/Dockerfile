FROM node

WORKDIR /client

COPY package*.json /client/

RUN npm i

COPY . /client/

EXPOSE 3000

CMD [ "npm", "start"]