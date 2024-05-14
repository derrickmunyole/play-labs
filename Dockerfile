# Use the official Node.js image as the base image
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY ./app .

# Expose the port that your application listens on
EXPOSE 3000

# Set the entry point for your application
CMD ["npm", "start"]