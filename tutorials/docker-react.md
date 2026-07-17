# Dockerizing a React Application for Production

In this tutorial, we will learn how to create an efficient Docker image for a React application using a multi-stage Dockerfile. This ensures our final image is small, secure, and fast.

## The Dockerfile

Create a file named `Dockerfile` in the root of your React project:

```dockerfile
# Stage 1: Build the React Application
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the App with Nginx
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Building and Running

To build the Docker image, run:
```bash
docker build -t my-react-app .
```

To run the container:
```bash
docker run -p 8080:80 my-react-app
```

Now you can visit `http://localhost:8080` in your browser!
