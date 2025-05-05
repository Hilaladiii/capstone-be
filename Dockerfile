FROM node:20.18-alpine as BUILDER

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

FROM node:20.18-alpine

WORKDIR /usr/src/app

COPY --from=BUILDER /usr/src/app /usr/src/app/

EXPOSE 8000

CMD ["sh", "-c", "npx prisma generate && npm run build && npm run start:prod"]