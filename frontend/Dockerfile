# Build stage
FROM node:16-alpine AS build

WORKDIR /app

# Set npm registry and timeout
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-timeout 600000
RUN npm config set fetch-retry-mintimeout 10000
RUN npm config set fetch-retry-maxtimeout 60000

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:1.21-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]