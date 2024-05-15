# Stage 1: Build TypeScript app
FROM node:21-alpine AS build

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Copy source code
COPY . .

# Build TypeScript app
RUN yarn build

# Stage 2: Run Node.js app
FROM node:21-alpine

# Set working directory
WORKDIR /app

# Copy built app from previous stage
COPY --from=build /app/dist .

# Install only production dependencies
COPY package*.json ./
RUN yarn install --production

COPY .env ./

# Start app
CMD ["node", "index.js"]
