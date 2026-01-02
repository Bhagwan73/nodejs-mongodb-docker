# Use official Node.js image
FROM node:20-alpine3.21

# Create app directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the app
CMD ["npm", "run","prod"]
