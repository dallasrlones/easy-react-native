FROM node:lts-alpine

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package.json /app/

# Install dependencies
RUN npm i

# Copy all files to /app
COPY . /app

# Expose port 1337
EXPOSE 1337
EXPOSE 5432
EXPOSE 6379