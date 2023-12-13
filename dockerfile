FROM node:18-slim

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

# Copy the application code into the container
COPY ./client ./client
COPY ./server ./server 
COPY ./.env ./

CMD ["npm", "start"]