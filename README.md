# NodeJS Mongo Docker Starter

A simple Node.js and MongoDB project using Docker and Docker Compose.  
This project demonstrates how a Node.js application connects to a MongoDB container using Docker networking and how MongoDB data is persisted using Docker volumes.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Docker
- Docker Compose

## Project Purpose
- Run Node.js and MongoDB in separate Docker containers
- Connect Node.js container to MongoDB container
- Use Docker volumes for persistent MongoDB storage
- Understand basic Docker container networking

## How It Works
- Node.js runs in one container
- MongoDB runs in another container
- Both containers communicate using Docker Compose service names
- MongoDB data is stored using a Docker volume

## Run the Project
```bash
docker-compose up --build
