# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the local code to the container
COPY . .

# Expose the port on which the app will run
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
