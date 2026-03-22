# Use a lightweight Node.js Alpine Linux image
FROM node:23.6.1-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package files first (for efficient layer caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the entire project (including index.js) into the container
COPY . .

# Expose port 3000 for the Node.js server (metadata)
EXPOSE 3000

# The default command to run your app
CMD ["node", "index.js"]
