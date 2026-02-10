# Frontend Dockerfile

FROM node:20-alpine

# Install libc6-compat for Next.js
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

EXPOSE 3000

# Next.js development server
CMD ["npm", "run", "dev"]