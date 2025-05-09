FROM node:20.18-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20.18-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 8000


CMD ["npm", "run", "start:prod"]
