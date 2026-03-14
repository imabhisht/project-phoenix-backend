# Stage 1: install deps and build
FROM node:22.17.1-alpine AS build
WORKDIR /usr/src/app

# Copy package metadata and install dependencies
COPY package.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: runtime image
FROM node:22.17.1-alpine AS runtime
WORKDIR /usr/src/app

# Copy built output and package.json for production deps
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./

RUN npm install --production

# Default runtime env; override via docker run / CI env vars / --env-file
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main"]
