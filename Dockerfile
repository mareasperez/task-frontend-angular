###### Install dependencies only when needed ######
FROM node:latest AS builder

# Make /app as working directory
WORKDIR /app

# Copy package.json file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the source code to the /app directory
COPY . .

# Build the application
RUN npm run build  --output-path=dist/ --output-hashing=all


######  Use NgInx alpine image  ###### 
FROM nginx:alpine

# Remove default nginx website
WORKDIR /usr/share/nginx/html/
RUN rm -rf ./*
# Copy nginx config file
COPY ./nginx/nginx.conf /etc/nginx/conf.d

# Copy dist folder fro build stage to nginx public folder
COPY --from=builder /app/dist/task-frontend-angular/ .

# Start NgInx service
CMD ["nginx", "-g", "daemon off;"]
