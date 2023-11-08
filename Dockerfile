# stage 0: Install dependencies
FROM node:18.18.2@sha256:a6385a6bb2fdcb7c48fc871e35e32af8daaa82c518900be49b76d10c005864c2 AS dependencies

LABEL maintainer="Ben Akram bakram4@myseneca.ca" \
  description="Fragments-UI Next.js UI"

WORKDIR /app

COPY package*.json ./

RUN npm install

# stage 1: Copy files and run the application
FROM node:alpine

WORKDIR /app

COPY --from=dependencies /app .

COPY . .

ENV PORT=3030

CMD npm run dev

EXPOSE 3030
