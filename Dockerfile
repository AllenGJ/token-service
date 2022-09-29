# syntax=docker/dockerfile:1

FROM node:16.17.1 as base

RUN ["apt", "update"]
RUN ["apt", "install", "redis", "-y"]

ENV CI=true
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]

FROM base as test
RUN ["npm", "ci"]
COPY . .
CMD service redis-server start && npm test

FROM base as production
ENV NODE_ENV=production
RUN ["npm", "ci", "--production"]
COPY . .
CMD service redis-server start && npm start