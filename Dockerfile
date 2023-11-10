# stage 0: Install dependencies
FROM node:18.18.2@sha256:a6385a6bb2fdcb7c48fc871e35e32af8daaa82c518900be49b76d10c005864c2 AS build

LABEL maintainer="Ben Akram bakram4@myseneca.ca" \
    description="Fragments-UI Next.js UI"

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# stage 1: Copy files and run the application
FROM nginx:1.25.3@sha256:86e53c4c16a6a276b204b0fd3a8143d86547c967dc8258b3d47c3a21bb68d3c6

# setup nodejs
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN apt-get update && apt-get install -y --no-install-recommends\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/share/nginx/html

# copy the build files from the previous stage
COPY --from=build /app/out .

EXPOSE 80



