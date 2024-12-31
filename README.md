# E-commerce Platform with GitHub Actions and deployment to Amazon ECS

A modern, containerized Pet Accessories E-commerce platform featuring automated CI/CD with GitHub Actions and deployment to Amazon ECS. This project implements a complete DevOps pipeline for a pet accessories online store, built with React, Node.js, and MongoDB.

[![GitHub Actions CI/CD](https://github.com/franklynux/ecommerce-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/franklynux/ecommerce-platform/actions/workflows/deploy.yml)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![AWS ECR](https://img.shields.io/badge/AWS-ECR-orange.svg)](https://aws.amazon.com/ecr/)

## Table of Contents

- [E-commerce Platform with GitHub Actions and deployment to Amazon ECS](#e-commerce-platform-with-github-actions-and-deployment-to-amazon-ecs)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Architecture Overview](#architecture-overview)
  - [Prerequisites](#prerequisites)
  - [Project Structure](#project-structure)
  - [Local Development Setup](#local-development-setup)
  - [Creating ECS Cluster, Service, and Task Definitions](#creating-ecs-cluster-service-and-task-definitions)
    - [Step 1: Create an ECS Cluster](#step-1-create-an-ecs-cluster)
    - [Step 2: Create a Task Definition](#step-2-create-a-task-definition)
    - [Step 3: Create a Service](#step-3-create-a-service)
  - [Docker Configuration](#docker-configuration)
    - [Backend Docker Configuration](#backend-docker-configuration)
    - [Frontend Docker Configuration](#frontend-docker-configuration)
    - [Creating Private Repositories for Container Images](#creating-private-repositories-for-container-images)
  - [Setting Up GitHub Secrets](#setting-up-github-secrets)
  - [GitHub Actions Workflow](#github-actions-workflow)
    - [Environment Setup](#environment-setup)
    - [Build and Push Process](#build-and-push-process)
  - [Security Implementation](#security-implementation)
    - [IAM Roles and Permissions](#iam-roles-and-permissions)
    - [Network Security](#network-security)
    - [Application Security](#application-security)
    - [Container Optimization](#container-optimization)
    - [Application Performance](#application-performance)
    - [Monitoring Performance](#monitoring-performance)
  - [Monitoring and Observability](#monitoring-and-observability)
    - [Accessing Deployed Containers](#accessing-deployed-containers)
      - [Frontend Container (Port 80)](#frontend-container-port-80)
      - [Backend Container (Port 5000)](#backend-container-port-5000)
    - [Monitoring Deployed Containers](#monitoring-deployed-containers)
      - [CloudWatch Logs Access](#cloudwatch-logs-access)
      - [CloudWatch Container Insights](#cloudwatch-container-insights)
    - [Container Health Verification](#container-health-verification)
    - [Alerting](#alerting)
  - [Troubleshooting Guide](#troubleshooting-guide)
    - [Common Issues](#common-issues)
    - [Debug Procedures](#debug-procedures)
    - [Logging Best Practices](#logging-best-practices)
  - [Contributing](#contributing)
  - [License](#license)
  - [Getting Help](#getting-help)

## Introduction

This README provides step-by-step instructions for setting up and deploying the Pet Accessories E-commerce Platform using AWS ECS. Follow the sections below to get started.

## Architecture Overview

![Architecture Diagram](./images/Architectural%20diagram.png)
*System Architecture Overview*

The platform consists of:

- **Frontend**: React application with Tailwind CSS
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions
- **Cloud Platform**: AWS ECR/ECS
- **Reverse Proxy**: Nginx

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18+)
- Docker and Docker Compose
- AWS CLI configured
- GitHub account
- MongoDB instance (see [Setup Guide](mongodb_atlas_setup_guide.md) for details)

## Project Structure

Below is a consise ***Project Directory Structure Overview***

```plaintext
ecommerce-platform/
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # Consolidated workflow file
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── nginx.conf
│   └── default.conf
│
├── backend/
│   ├── src/
│   │   ├── app.js                # Main application file
│   │   ├── index.js              # Entry point
│   │   ├── controllers/          # Business logic
│   │   ├── middleware/           # Middleware functions
│   │   ├── models/               # Database models
│   │   └── routes/               # API routes
│   └── tests/                    # Test files
│
└── frontend/
    ├── public/                   # Static assets
    ├── src/
    │   ├── App.jsx               # Main React component
    │   ├── index.jsx             # Entry point for React
    │   └── components/           # React components
    └── index.html                # Main HTML file
```

## Local Development Setup

Follow these steps to set up the local development environment:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/franklynux/ecommerce-platform.git
   cd ecommerce-platform
   ```

2. **Set up environment variables:**

   - **Frontend (.env)**

     ```bash
     VITE_API_URL=http://localhost:5000/api
     ```

     ![Frontend env](./images/fronend%20env.png)

   - **Backend (.env)**

     ```bash
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

     ![backend env](./images/backend%20env.png)

3. **Start the development servers:**

   - **Using Docker Compose**

     ```bash
     docker-compose up -d
     ```

   - **Without Docker**

     ```bash
     cd frontend && npm run dev
     cd backend && npm run dev
     ```

   **Expected Output (Backend):**
   ![local dev backend](./images/2.%20local%20dev%20(backend)%20npm%20run%20dev.png)
   ***Backend API Running:***
   ![local dev API running](./images/localhos%20backend%20running.png)

   **Expected Output (Frontend):**
   ![local dev frontend](./images/2.%20local%20dev%20(frontend)%20npm%20run%20dev.png)
   ***WebApp Running on LocalHost:***
   ![local dev webapp running](./images/local%20hos%20running%20app.png)

## Creating ECS Cluster, Service, and Task Definitions

### Step 1: Create an ECS Cluster

1. **Log in to the AWS Management Console**.
2. Navigate to the **ECS** service by searching for "ECS" in the services search bar.
   ![ECS console navi](./images/ECS%20navi.png)
3. Click on **Clusters** in the left navigation pane.
4. Click on the **Create Cluster** button.
   ![ECS console cluster](./images/ECS%20console%20creae%20cluser.png)
5. For Infrastructure configuration, choose the **AWS Fargate (Serverless)** option or **Amazon EC2 Instances** based on your requirements. We will use **AWS Fargate (Serverless)** for this project.
   ![ECS console infras](./images/ECS%20console%20creae%20cluser%20(infras).png)
6. Enter a **Cluster name**: `myAPPCluster`.
   ![ECS console cluster name](./images/ECS%20console%20creae%20cluser%201.png)
7. Configure the Monitoring option to enable **Container Insights with enhanced observability**.
   ![ECS console monitoring](./images/ECS%20console%20creae%20cluser%20(monioring).png)
8. Click **Create**.
   ![ECS console finish](./images/ECS%20console%20creae%20cluser%20(finish).png)

### Step 2: Create a Task Definition

1. In the ECS console, click on **Task Definitions** in the left navigation pane.
2. Select the **Create new Task Definition with JSON** option.
   ![ECS task definition JSON](./images/ECS%20console%20creae%20new%20ask%20definiion.png)
3. Enter a **Task Definition Name**: `my-app`.
4. Set the **Task size** (memory and CPU) according to your application needs.
**Note:** The task definition would contain configurations for both the **frontend** and **backend** containers.

**Task Definition configuration in JSON (below):**

```json
{
    "family": "my-app",
    "containerDefinitions": [
        {
            "name": "backend",
            "image": "014498645423.dkr.ecr.us-east-1.amazonaws.com/projects/pet-accessories-backend",
            "cpu": 1024,
            "memory": 3072,
            "memoryReservation": 2048,
            "portMappings": [
                {
                    "name": "5000",
                    "containerPort": 5000,
                    "hostPort": 5000,
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [
                {
                    "name": "PORT",
                    "value": "5000"
                },
                {
                    "name": "MONGODB_URI",
                    "value": "mongodb+srv://franklynux:admin123@testcluster.40akg.mongodb.net/pet-accessories"
                },
                {
                    "name": "NODE_ENV",
                    "value": "production"
                }
            ],
            "mountPoints": [],
            "volumesFrom": [],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/my-app",
                    "mode": "non-blocking",
                    "awslogs-create-group": "true",
                    "max-buffer-size": "25m",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            },
            "healthCheck": {
                "command": [
                    "CMD-SHELL",
                    "curl -f http://localhost:5000/api/health"
                ],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            },
            "systemControls": []
        },
        {
            "name": "frontend",
            "image": "014498645423.dkr.ecr.us-east-1.amazonaws.com/projects/pet-accessories-frontend:991b3b666effebb71d3a05e110dbe2865b701645",
            "cpu": 1024,
            "memory": 2048,
            "portMappings": [
                {
                    "name": "frontend-80-tcp",
                    "containerPort": 80,
                    "hostPort": 80,
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [
                {
                    "name": "NGINX_PROXY_TEMP_PATH",
                    "value": "/tmp/nginx/proxy_temp"
                },
                {
                    "name": "NGINX_UWSGI_TEMP_PATH",
                    "value": "/tmp/nginx/uwsgi_temp"
                },
                {
                    "name": "NGINX_SCGI_TEMP_PATH",
                    "value": "/tmp/nginx/scgi_temp"
                },
                {
                    "name": "NGINX_FASTCGI_TEMP_PATH",
                    "value": "/tmp/nginx/fastcgi_temp"
                },
                {
                    "name": "NGINX_CLIENT_TEMP_PATH",
                    "value": "/tmp/nginx/client_temp"
                }
            ],
            "mountPoints": [],
            "volumesFrom": [],
            "dependsOn": [
                {
                    "containerName": "backend",
                    "condition": "HEALTHY"
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/my-app",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            },
            "healthCheck": {
                "command": [
                    "CMD-SHELL",
                    "curl -f http://localhost:80/health || exit 1"
                ],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            },
            "systemControls": []
        }
    ],
    "taskRoleArn": "arn:aws:iam::014498645423:role/ecsTaskRole",
    "executionRoleArn": "arn:aws:iam::014498645423:role/ecsTaskExecutionRole",
    "networkMode": "awsvpc",
    "volumes": [],
    "placementConstraints": [],
    "requiresCompatibilities": [
        "FARGATE"
    ],
    "cpu": "2048",
    "memory": "5120",
    "runtimePlatform": {
        "cpuArchitecture": "X86_64",
        "operatingSystemFamily": "LINUX"
    },
    "enableFaultInjection": false
}
```

***Expected Output:***
![ECS task definition JSON](./images/ECS%20console%20creae%20new%20ask%20definiion%20(JSON%20config).png)

### Step 3: Create a Service

1. In the ECS console, navigate to your cluster by clicking on **Clusters** and selecting `myAPPCluster`.
2. Click on the **Services** tab.
3. Click on the **Create** button.
   ![ECS console create service](./images/ECS%20console%20creae%20service.png)
4. Choose the launch type (Fargate) and select the task definition (my-app) created earlier.
   ![ECS console create service](./images/ECS%20console%20creae%20service%20(launch%20fargae).png)
5. Enter a **Service name**: `ecommerce-webapp`.
6. Set the **Number of tasks** to run (e.g., `1`).
   ![ECS console create service](./images/ECS%20console%20creae%20service%20(deplo%20config%202).png)
7. Configure the **Load balancer** settings if needed (optional).
8. Click **Next step** to configure the network settings:
   - Select the **VPC** and **Subnets**.
   - Choose the **Security group**.
   ![ECS console VPC & SG](./images/ECS%20console%20create%20service%20(network%20config).png)
9. Review the service settings.
10. Click **Create**.
   ![ECS console service complete](./images/ECS%20console%20create%20service%20(finish).png)

11. Wait for the service to be created and the tasks to be running.
12. Verify the service is running by checking the **Tasks** tab in the ECS console.
   ![ECS console service & tasks running](./images/ECS%20console%20deploment%20successful.png)

## Docker Configuration

To run the application, you need to create Dockerfiles to build docker images for both Frontend & Backend Applications in the **docker** folder of your project.

### Backend Docker Configuration

```dockerfile
FROM node:18-alpine

# Add necessary build tools
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

WORKDIR /app

# Copy package files
COPY package*.json ./ 
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --production

# Copy backend source
COPY backend/ ./backend/

WORKDIR /app/backend

# Set correct permissions
RUN chown -R node:node /app
USER node

# Environment configuration
ENV NODE_ENV=production \
    PORT=5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

EXPOSE 5000

CMD ["node", "src/index.js"]
```

![docker backend](./images/docker%20backend.png)

### Frontend Docker Configuration

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

FROM nginx:alpine

# Install necessary utilities
RUN apk add --no-cache curl

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx \
             /var/log/nginx \
             /var/run/nginx \
             /tmp/nginx/client_temp \
             /tmp/nginx/proxy_temp \
             /tmp/nginx/fastcgi_temp \
             /tmp/nginx/uwsgi_temp \
             /tmp/nginx/scgi_temp \
             /usr/share/nginx/html \
    && addgroup -S nginx 2>/dev/null || true \
    && adduser -S -G nginx -H -D nginx 2>/dev/null || true \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /var/run/nginx \
    && chown -R nginx:nginx /tmp/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /var/cache/nginx \
    && chmod -R 755 /var/log/nginx \
    && chmod -R 755 /var/run/nginx \
    && chmod -R 755 /tmp/nginx

# Copy built assets and configuration
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Set up health check file
RUN echo "OK" > /usr/share/nginx/html/health.txt \
    && chown nginx:nginx /usr/share/nginx/html/health.txt \
    && chmod 644 /usr/share/nginx/html/health.txt

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:80/health.txt || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

![docker frontend](./images/docker%20fronend.png)

### Creating Private Repositories for Container Images

To create private repositories for the backend and frontend container images, follow these steps:

1. **Create a Private Repository on Docker Hub or AWS ECR**:
   - **For Docker Hub:**
     - Log in to your Docker Hub account.
     - Click on "Create Repository".
     - Name your repository (e.g., `pet-accesories-frontend` and `pet-accesories-backend`).
     - Set the repository to private.
   - **For AWS ECR:**
     - Open the AWS Management Console.
     - Navigate to the ECR service.
       ![ECR navi](./images/ECR%20console%20navi.png)
     - Click on "Create repository".
       ![ECR navi](./images/ECR%20console%20navi%202.png)
     - Name your repository (e.g., `project/ecommerce-frontend` and `project/ecommerce-backend`).
     - Ensure the repository is private.
       - Backend Image Repository:
       ![ECR backend repo ](./images/ECR%20creae%20backend%20repo.png)
       - Frontend Image Repository:
       ![ECR frontend repo](./images/ECR%20creae%20fronend%20repo.png)
       - Repositories Created:
       ![ECR repos ready](./images/ECR%20repos%20read.png)

   **Note:** Ensure to note the repositories URLs.

2. **Tag the Images**:
   - After building your images, tag them with the repository URI:

     ```bash
     # For Docker Hub
     docker tag ecommerce-frontend:latest yourusername/pet-accessories-frontend:latest
     docker tag ecommerce-backend:latest yourusername/pet-accessories-backend:latest

     # For AWS ECR
     docker tag pet-accessories-frontend:latest <ECR_URI>/pet-accessories-frontend:latest
     docker tag pet-accessories-backend:latest <ECR_URI>/pet-accessories-backend:latest
     ```

3. **Push the Images to the Private Repository**:
   - Log in to your Docker Hub or AWS ECR:

     ```bash
     # For Docker Hub
     docker login

     # For AWS ECR
     aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <ECR_URI>
     ```

   - Push the images:

     ```bash
     # For Docker Hub
     docker push franklynux/ecommerce-frontend:latest
     docker push franklynux/ecommerce-backend:latest

     # For AWS ECR
     docker push <ECR_URI>/ecommerce-frontend:latest
     docker push <ECR_URI>/ecommerce-backend:latest
     ```

## Setting Up GitHub Secrets

To securely store sensitive information, you need to set up GitHub Secrets in your repository. Follow these steps:

1. Go to your GitHub repository.
2. Click on "Settings" > "Secrets and variables" > "Actions".
3. Click on "New repository secret" for each of the following:

   - **AWS_ACCESS_KEY_ID**: Your AWS access key ID.
   - **AWS_SECRET_ACCESS_KEY**: Your AWS secret access key.
   - **DOCKER_USERNAME**: Your Docker Hub username.
   - **DOCKER_PASSWORD**: Your Docker Hub password.
   - **JWT_SECRET**: Your JWT secret token.
   - **MONGODB_URI**: Your MongoDB connection string.
   - **VITE_API_URL**: The API URL for your Vite application.

   **Expected Output:**
   ![GitHub Secrets](./images/GitHub%20secrets.png)

## GitHub Actions Workflow

![CI/CD Pipeline](./images/git%20actions%20pipeline.png)
*Workflow CI/CD Pipeline Overview*

The `.github/workflows/deploy.yml` workflow handles:

1. Testing
2. Building Docker images
3. Pushing to ECR
4. Deploying to ECS

### Environment Setup

```yaml
env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY_FRONTEND: projects/pet-accessories-frontend
  ECR_REPOSITORY_BACKEND: projects/pet-accessories-backend
  ECS_CLUSTER: myAppCluster
  ECS_SERVICE: ecommerce-webapp
  ECS_TASK_DEFINITION: my-app
```

### Build and Push Process

```yaml
- name: Build and push images
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    IMAGE_TAG: ${{ github.sha }}
  run: |
    docker build -f docker/Dockerfile.frontend -t $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG .
    docker build -f docker/Dockerfile.backend -t $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG .
    docker push $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG
    docker push $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG
```

## Security Implementation

### IAM Roles and Permissions

1. **ECS Task Role (ecsTaskRole)**:
   - Permissions for task-level AWS API access
   - Used for application-specific AWS service access
   - Required policies:

     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "ecr:GetAuthorizationToken",
             "ecr:BatchCheckLayerAvailability",
             "ecr:GetDownloadUrlForLayer",
             "ecr:BatchGetImage"
           ],
           "Resource": "*"
         }
       ]
     }
     ```

     **Expected Output:**
     ![ecstaskrole](./images/IAM%20role%20(ecstaskrole).png)

2. **ECS Task Execution Role (ecsTaskExecutionRole)**:
   - Permissions for ECS agent
   - ECR image pull
   - CloudWatch logs
   - Required policies:

     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "logs:CreateLogStream",
             "logs:PutLogEvents"
           ],
           "Resource": "arn:aws:logs:us-east-1:014498645423:log-group:/ecs/ecommerce-webapp:log-stream:"
         }
       ]
     }
     ```

     **Expected Output:**
     ![ecstaskExecutionrole](./images/IAM%20role%20(ecstaskExecutionrole).png)

### Network Security

1. **Security Groups:**

   ```plaintext
   Inbound Rules:
   - Port 80 (Frontend container)
   - Port 5000 (Backend API)
   Outbound Rules:
   - All traffic
   ```

   **Expected Output:**
   ![securitygroup](./images/Ecommerce%20SG%20inbound%20rules.png)

2. **VPC Configuration:**
   - Private subnets for ECS tasks
   - Public subnets for container instances

### Application Security

1. **CORS Configuration:**
   - Restricted to frontend domain
   - Proper HTTP methods allowed
   - Secure headers implemented

2. **Environment Variables:**
   - Sensitive data stored in AWS Secrets Manager
   - Environment-specific configurations

### Container Optimization

1. **Docker Image Size:**
   - Multi-stage builds
   - Minimal base images
   - Layer optimization

2. **Resource Allocation:**
   - Proper CPU and memory limits
   - Container placement strategies

### Application Performance

1. **Frontend Optimization:**
   - Code splitting
   - Asset compression
   - Caching strategies

2. **Backend Optimization:**
   - Database indexing
   - Query optimization
   - Response caching

### Monitoring Performance

1. **Key Metrics:**
   - Container CPU/Memory usage
   - API response times
   - Error rates
   - Request throughput

2. **Performance Alerts:**
   - CPU utilization thresholds
   - Memory usage alerts
   - Response time degradation

## Monitoring and Observability

### Accessing Deployed Containers

#### Frontend Container (Port 80)

1. **Get Container(s) network address (Public IP):**

   - Navigate to ECS Cluster
   - Click "services" -> "tasks"
   - Select task ID
   - Navigate to running Containers (Frontend/Backend)
   - Click "Network bindings" -> "External link"
   - Note the public IP address with associated port number.

2. **Access Frontend Application:**
   ![Frontend Access](./images/ECS%20console%20frontend%20network%20address.png)
   *Frontend Application Access*
   - Open browser and visit: `http://<PUBLIC_IP>:80`
   - Verify homepage loads
   - Test navigation and features
   - Check browser console for errors
   ![Homepage loads](./images/Frontend%20webapp%20address.png)

3. **Frontend Health Check:**
   ![frontend health check](./images/frontend%20health%20check.png)
   *Frontend Health Check Response*

   ```bash
   # Using curl
   curl http://<PUBLIC_IP>:80/health.txt
   ```

#### Backend Container (Port 5000)

1. **Verify Backend API:**
   ![Backend Health](./images/backend%20health%20check.png)
   *Backend Health Check Response*
   - Test health endpoint: `http://<PUBLIC_IP>:5000/api/health`

   ```bash
   # Using curl
   curl http://<PUBLIC_IP>:5000/api/health
   ```

2. **Test API Endpoints:**

   ```bash
   # Get products
   curl http://<PUBLIC_IP>:5000/api/products
   ```

   ![API Testing](./images/API%20test%20(products).png)

3. **Monitor Backend Logs:**
   ![Backend Logs](./images/Container%20logs%20(backend).png)
   *Backend Application Logs*
   - Check CloudWatch logs for API requests
   - Verify correct status codes
   - Monitor response times

### Monitoring Deployed Containers

#### CloudWatch Logs Access

1. **Using AWS Console:**
   ![CloudWatch Console](./images/Cloudwatch%20console%20navi.png)
   *CloudWatch Console Navigation*
   - Go to AWS Management Console
   - Navigate to CloudWatch service
   - Select "Log groups" from left sidebar
   - Choose `/ecs/my-app`
     ![CloudWatch log group](./images/Cloudwatch%20log%20group%20navi%202.png)

2. **Using AWS CLI:**

   ```bash
   # Get application logs
   aws logs get-log-events \
     --log-group-name /ecs/my-app \
     --log-stream-name $(aws logs describe-log-streams \
     --log-group-name /ecs/my-app \
     --order-by LastEventTime \
     --descending --limit 1 \
     --query 'logStreams[0].logStreamName' \
     --output text)
   ```

3. **View Container Log Streams:**

   - Click on the respective log group
   - Select the latest log stream
   - View real-time logs with timestamp
   - Use filter patterns to search specific events:

     ```plaintext
     [timestamp, level="ERROR"]
     [timestamp, message="API request failed"]
     ```

     ![Log Streams](./images/Cloudwatch%20log%20stream%20(backend&frontend).png)
   *Container Log Streams*

4. **Real-time Log Monitoring Using CloudWatch Live Tail:**

   Using the AWS Management Console:
   ![Log Monitoring](./images/Cloudwatch%20Livetail%20console%201.png)
   ![Log Monitoring](./images/Cloudwatch%20Livetail%20console%202.png)
   *Real-time Log Monitoring Dashboard*

   Using the AWS CLI:

   ```bash
   # Watch application logs in real-time
   aws logs tail /ecs/my-app --follow
   ```

   *Note: The above command is for demonstration purposes only. You should replace `/ecs/my-app` with your actual log group name.*

#### CloudWatch Container Insights

To enable and use CloudWatch Container Insights for monitoring your ECS containers, follow these steps:

1. **Enable Container Insights**:
   - Navigate to the AWS ECS Console.
   - Select your ECS Cluster.
   - Click on the "Cluster Settings" tab.
   - Under "Container Insights", toggle the setting to enable it.
   - Click "Save".
   ![Container Insights config](./images/Container%20insights%20console.png)

2. **Accessing Container Insights**:
   - Go to the AWS Management Console.
   - Navigate to the CloudWatch service.
   - In the left navigation pane, click on "Insights".
   - Select "ECS" from the available options.

3. **Viewing Metrics**:
   - In the Container Insights dashboard, you can view various metrics such as CPU and memory usage, network traffic, and disk I/O for your containers.
   - Use the time range selector to adjust the period for which you want to view metrics.
   ![container insights](./images/WebApp%20dashboard%20review.png)

4. **Setting Up Alarms**:
   - To set up alarms based on specific metrics, go to the "Alarms" section in CloudWatch.
   - Click on "Create Alarm".
   - Choose the metric you want to monitor (e.g., CPU Utilization).
   - Set the conditions for the alarm (e.g., trigger if CPU Utilization exceeds 80%).
   - Configure notifications (e.g., send an email via SNS) and click "Create Alarm".

5. **Using CloudWatch Logs**:
   - Ensure that your ECS task definitions include log configuration to send logs to CloudWatch.
   - In the CloudWatch console, navigate to "Logs" to view the logs generated by your containers.
   - You can filter logs based on log groups and streams to find specific log entries.

   **Backend Container Logs:**
   ![cloudwatch logs backend](./images/Container%20logs%20(backend).png)

   **Frontend Container Logs:**
   ![cloudwatch logs backend](./images/Container%20logs%20(frontend).png)

6. **Analyzing Performance**:
   - Use the metrics and logs collected in CloudWatch to analyze the performance of your containers.
   - Look for trends in resource usage and identify any potential bottlenecks or issues.

   ![container insights](./images/Container%20insights%20console%20(containers).png)

   - Use this information to optimize your container configurations and improve overall performance.  

### Container Health Verification

1. **Container Status:**

   - Both containers running
   - Health checks passing
   - No restart loops

   ![Container Status](./images/Container%20health%20status.png)
   *ECS Container Status Dashboard*

2. **Network Connectivity:**
   - Ports accessible (80, 5000)
   - Security groups configured
   - Response times normal

3. **Application Health:**
   - Frontend loads correctly
   - API endpoints responding
   - No console errors
   - Logs showing normal activity

### Alerting

1. **CloudWatch Alarms:**

   ```bash
   # Create CPU utilization alarm
   aws cloudwatch put-metric-alarm \
     --alarm-name high-cpu \
     --metric-name CPUUtilization \
     --namespace AWS/ECS \
     --statistic Average \
     --period 300 \
     --threshold 80 \
     --comparison-operator GreaterThanThreshold
   ```

2. **Notification Setup:**
   - SNS topics for alerts
   - Email notifications
   - Slack integration

## Troubleshooting Guide

### Common Issues

1. **Container Startup Failures**

   ```bash
   # Check container logs
   aws logs get-log-events \
     --log-group-name /ecs/my-app \
     --log-stream-name <STREAM_NAME>
   
   # Check task status
   aws ecs describe-tasks \
     --cluster myAppCluster \
     --tasks <TASK_ID>
   ```

2. **Deployment Issues**

   ```bash
   # Check service events
   aws ecs describe-services \
     --cluster myAppCluster \
     --services ecommerce-webapp
   ```

3. **Network Connectivity**

   ```bash
   # Verify security group rules
   aws ec2 describe-security-groups \
     --group-ids <SECURITY_GROUP_ID>
   ```

### Debug Procedures

1. **Container Health Checks:**
   - Verify container health status
   - Check health check endpoints
   - Review health check logs

2. **Resource Issues:**
   - Monitor CPU/Memory usage
   - Check for resource constraints
   - Verify task definition limits

3. **Deployment Rollbacks:**

   ```bash
   # Roll back to previous task definition
   aws ecs update-service \
     --cluster myAppCluster \
     --service ecommerce-webapp \
     --task-definition <PREVIOUS_TASK_DEF>
   ```

### Logging Best Practices

1. **Log Levels:**
   - ERROR: System errors
   - WARN: Warning conditions
   - INFO: General information
   - DEBUG: Detailed debugging

2. **Log Format:**

   ```json
   {
     "timestamp": "ISO8601",
     "level": "ERROR|WARN|INFO|DEBUG",
     "service": "frontend|backend",
     "message": "Log message",
     "metadata": {}
   }
   ```

3. **Log Aggregation:**
   - Centralized logging
   - Log correlation
   - Search and analysis

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Getting Help

If you encounter any issues or have questions, please open an issue in the GitHub repository or contact me for assistance.
