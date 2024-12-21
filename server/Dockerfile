FROM node:20.15.0-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
