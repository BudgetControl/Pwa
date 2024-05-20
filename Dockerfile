FROM node:18.20.2 AS npm

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 8080
CMD [ "npm", "run", "serve" ]
