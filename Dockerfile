FROM node:20.18-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

RUN npm install pm2 -g

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20.18-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /usr/src/app

RUN npm install -g pm2

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/ecosystem.config.js ./ecosystem.config.js

EXPOSE 8000

CMD ["sh", "-c", "./wait-for-it.sh mysql_db:3306 -- npx prisma db push && pm2-runtime ecosystem.config.js"]


