FROM node

WORKDIR /server

COPY package*.json /server/

RUN npm i

COPY . /server/

EXPOSE 8000

CMD [ "npm", "start"]