# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

# Expose the port your server listens on
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
