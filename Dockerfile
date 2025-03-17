# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files
COPY . .

# Build the React application
RUN npm run build

# Use a lightweight Nginx server to serve the build output
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=0 /app/build /usr/share/nginx/html

# upgrade npm
RUN npm upgrade --force

# Expose port 80
EXPOSE 80

# Starting Nginx
CMD ["nginx", "-g", "daemon off;"]