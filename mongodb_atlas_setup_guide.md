# Guide to Create a Free Database Cluster on MongoDB Atlas

Follow these steps to set up a free database cluster on MongoDB Atlas:

## Step 1: Sign Up for MongoDB Atlas

1. Go to the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas).
2. Click on the "Sign Up" button.
3. Fill in the required information or sign up using your Google account.

## Step 2: Create a New Project

1. After signing in, click on "Projects" in the left sidebar.
2. Click on the "New Project" button.
3. Enter a name for your project and click "Next".

## Step 3: Build a Cluster

1. In your project dashboard, click on "Build a Cluster".
2. Choose the "Free Tier" option.
3. Select a cloud provider (e.g., AWS, Google Cloud, Azure) and a region close to you.
4. Click on "Create Cluster".

## Step 4: Configure Database Access

1. After the cluster is created, click on "Database Access" in the left sidebar.
2. Click on "Add New Database User".
3. Set a username and password for your database user.
4. Choose "Read and write to any database" for user privileges.
5. Click "Add User".

## Step 5: Configure Network Access

1. Click on "Network Access" in the left sidebar.
2. Click on "Add IP Address".
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development purposes.
4. Click "Confirm".

## Step 6: Connect to Your Cluster

1. Go back to your cluster dashboard.
2. Click on "Connect" for your cluster.
3. Choose "Connect your application".
4. Copy the connection string provided.
5. Replace `<username>` and `<password>` with your database user credentials.

## Step 7: Use the Connection String

1. Use the connection string in your application to connect to the MongoDB Atlas cluster.
2. Ensure your application has the MongoDB driver installed.

## Conclusion

You now have a free MongoDB Atlas cluster set up and ready to use for your application. Make sure to monitor your usage to stay within the free tier limits.
