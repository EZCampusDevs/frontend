FROM node:latest

ARG DIR="/opt/app"

WORKDIR $DIR

# Install dependencies
COPY frontend $DIR/frontend

WORKDIR $DIR/frontend/client

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
