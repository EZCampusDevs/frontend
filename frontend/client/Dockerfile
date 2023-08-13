# Build the client files in a build stage
FROM node:lts-alpine as build
RUN apk add --no-cache git

WORKDIR /app

# Install npm dependencies
COPY package*.json /app/
RUN npm ci

COPY . /app
RUN npm run docker-build

FROM nginx:alpine

# Copy in nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy in the built app from the build stage
COPY --from=build /app/build/ /usr/share/nginx/html
