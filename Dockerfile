FROM node:14-alpine as builder
WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm ci

COPY ./  ./
RUN npm run test
RUN npm run build

FROM node:14-alpine

RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist /usr/src/app/dist

EXPOSE 8080
ENTRYPOINT [ "node", "dist/index.js" ]

