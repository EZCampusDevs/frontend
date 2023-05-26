# pull official base image for node
FROM node:16-buster-slim

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to PATH
ENV PATH /app/node_modules/.bin:$PATH

# install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i -g npm@latest
RUN npm install

# copy all src files to the container
COPY . .

# Expose port
EXPOSE ${REACT_PORT}

# start the web app
CMD ["npm", "run", "start"]