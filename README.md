# Forum9 Full-Stack App Setup via Docker

This repository contains the full-stack app `Forum9` built with:

- **Frontend**: React (Vite)
- **Backend**: Express (Node.js)
- **Database**: MongoDB

This is the swagger api
![image](https://github.com/user-attachments/assets/855033a3-2b9e-4b5b-a0a4-5422336be199)
This is the mongoDB connection
![image](https://github.com/user-attachments/assets/a2d3c1e9-3ae5-47a3-8683-a03efd18d137)
This is firebase
![image](https://github.com/user-attachments/assets/45915135-87ca-45f1-bade-89c6f6429bf5)


You can easily set up and run the app using Docker images directly from Docker Hub.

## Getting Started

Follow the instructions below to set up and run the app using Docker images.

### Prerequisites

Ensure you have Docker installed on your machine. You can download Docker from the following link:  
[Download Docker](https://www.docker.com/get-started)

### Pull Docker Images

1. **Pull the frontend and backend images from Docker Hub**:

   Run the following commands in your terminal:

   ```bash
   docker pull waengs/forum9-client:latest
   docker pull waengs/forum9-server:latest
