# ECS Setup Guide

## Creating ECS Cluster, Service, and Task Definitions

### Step 1: Create an ECS Cluster

1. **Log in to the AWS Management Console**.
2. Navigate to the **ECS** service by searching for "ECS" in the services search bar.
3. Click on **Clusters** in the left navigation pane.
4. Click on the **Create Cluster** button.
5. Choose the **Networking only** option (for Fargate) or **EC2 Linux + Networking** (for EC2 launch type) based on your requirements.
6. Click **Next step**.
7. Enter a **Cluster name**: `myAPPCluster`.
8. Configure any additional settings as needed (e.g., VPC, subnets).
9. Click **Create**.

### Step 2: Create a Task Definition

1. In the ECS console, click on **Task Definitions** in the left navigation pane.
2. Click on the **Create new Task Definition** button.
3. Choose the launch type compatibility (Fargate or EC2) and click **Next step**.
4. Enter a **Task Definition Name**: `my-app`.
5. Set the **Task size** (memory and CPU) according to your application needs.
6. In the **Container definitions** section, click on **Add container**.

#### Container Definitions

- **Frontend Container**:
  - **Container name**: `frontend`
  - **Image**: Enter the URI of your frontend Docker image.
  - **Memory Limits**: Set the memory limit (e.g., `512` MiB).
  - **Port mappings**: Add a port mapping (e.g., `80` for HTTP).
  
- **Backend Container**:
  - Click on **Add container** again.
  - **Container name**: `backend`
  - **Image**: Enter the URI of your backend Docker image.
  - **Memory Limits**: Set the memory limit (e.g., `512` MiB).
  - **Port mappings**: Add a port mapping (e.g., `3000` for the backend API).

7. Click **Add** after defining each container.
8. Configure any additional settings (e.g., environment variables, logging).
9. Click **Create** to save the task definition.

### Step 3: Create a Service

1. In the ECS console, navigate to your cluster by clicking on **Clusters** and selecting `myAPPCluster`.
2. Click on the **Services** tab.
3. Click on the **Create** button.
4. Choose the launch type (Fargate or EC2) and select the task definition you created earlier.
5. Enter a **Service name**: `ecommerce-webapp`.
6. Set the **Number of tasks** to run (e.g., `1`).
7. Configure the **Load balancer** settings if needed (optional).
8. Click **Next step** to configure the network settings:
   - Select the **VPC** and **Subnets**.
   - Choose the **Security group**.
9. Click **Next step** to review the service settings.
10. Click **Create Service**.

### Example Task Definition JSON

Here is an example of what the task definition JSON might look like:

```json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "your-frontend-image-uri",
      "memory": 512,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
        }
      ]
    },
    {
      "name": "backend",
      "image": "your-backend-image-uri",
      "memory": 512,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000
        }
      ]
    }
  ],
  "requiresCompatibilities": [
    "FARGATE"
  ],
  "cpu": "256",
  "memory": "1024"
}
