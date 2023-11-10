# stage 0: Install dependencies
FROM node:18.18.2@sha256:a6385a6bb2fdcb7c48fc871e35e32af8daaa82c518900be49b76d10c005864c2 AS build

LABEL maintainer="Ben Akram bakram4@myseneca.ca" \
    description="Fragments-UI Next.js UI"

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build


# stage 1: Copy files and run the application
FROM nginx:1.25.3@sha256:86e53c4c16a6a276b204b0fd3a8143d86547c967dc8258b3d47c3a21bb68d3c6

# setup nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get update && apt-get install -y \
        build-essential \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/share/nginx/html

# copy the build files from the previous stage
COPY --from=build /app/out .


EXPOSE 80












# test
# FROM node:18.18.2-alpine3.18@sha256:435dcad253bb5b7f347ebc69c8cc52de7c912eb7241098b920f2fc2d7843183d

# # 
# # add a non root user
# RUN adduser -D nextuser

# WORKDIR /app

# # https://towardsserverless.com/articles/dockerize-nextjs-app
# # copy the public folder from the project as this is not included in the build process
# COPY --from=build --chown=nextuser:nextuser /app/public ./public
# # copy the standalone folder inside the .next folder generated from the build process 
# COPY --from=build --chown=nextuser:nextuser /app/.next/standalone ./
# # copy the static folder inside the .next folder generated from the build process 
# COPY --from=build --chown=nextuser:nextuser /app/.next/static ./.next/static

# # set non root user as the default user
# USER nextuser

# EXPOSE 3000

# ENV PORT=3000 \
#     NODE_ENV=production

# CMD ["node", "server.js"]

