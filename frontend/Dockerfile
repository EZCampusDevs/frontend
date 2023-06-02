FROM node:latest

ARG DIR="/opt/app"

WORKDIR $DIR

# Install dependencies
COPY client $DIR/frontend

WORKDIR $DIR/frontend

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
