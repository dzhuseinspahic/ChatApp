FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

# Copy the application code into the container
COPY ./client ./client
COPY ./server ./server 
COPY ./.env ./

CMD ["npm", "start"]