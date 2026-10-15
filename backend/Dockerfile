FROM node:20-alpine

RUN apk add --no-cache redis

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm install -g pm2

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build

EXPOSE 5000

CMD redis-server --daemonize yes && npm run start