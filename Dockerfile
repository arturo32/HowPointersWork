FROM node:alpine3.20

WORKDIR /app

COPY . .

RUN npm install --global http-server

ENTRYPOINT ["http-server", ".", "-c-1"]
