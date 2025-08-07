FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Copy .env (optional if mounted via volume or passed in compose)
# COPY .env .env

EXPOSE 5000
CMD ["npm", "start"]
