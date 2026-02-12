# ToDo App - DevOps Project

This documentation covers how to manage the ToDo application deployed on AWS EC2.

## Server Details
- **Public IP**: `54.160.157.188`
- **User**: `ubuntu`

## 1. Connect to Server
Prerequisite: You need the private key file (e.g., `ec2-key.pem`) used to create the instance.

```bash
# Replace path/to/key.pem with your actual key file path
ssh -i "path/to/key.pem" ubuntu@54.160.157.188
```

## 2. Stop Application
Once logged into the server, you can stop the running containers:

```bash
# Stop all services defined in docker-compose
docker compose down

# (Optional) Force remove the mongodb container if it persists
docker rm -f mongodb
```

## 3. Rerun Application
To restart the application with the latest configurations, run the following commands on the server. We export the necessary environment variables first (derived from the `Jenkinsfile`).

```bash
# 1. Export Environment Variables
export FRONTEND_IMAGE=dilshanwmp/todo_app_frontend
export BACKEND_IMAGE=dilshanwmp/todo_app_backend
export VITE_API_BASE_URL=http://54.160.157.188:5000/api
export FRONTEND_URL=http://54.160.157.188:5173
export JWT_SECRET=12345678

# 2. Pull latest images (optional, if you want to ensure you have the latest code)
docker compose pull

# 3. Start services in detached mode
docker compose up -d
```

## 4. Access Hosted Database (MongoDB)

### Option A: Connect via SSH Tunnel (Recommended for GUI Tools)
This allows you to verify the data using tools like **MongoDB Compass** on your local machine, as if the database was running locally.

1.  **Open a new terminal** on your local machine (WSL/PowerShell).
2.  Run the SSH tunnel command:
    ```bash
    # Forwards remote port 27017 to your local port 27017
    ssh -i "path/to/key.pem" -N -L 27017:localhost:27017 ubuntu@54.160.157.188
    ```
    *(Note: The terminal will appear to hang or wait. This is normal. keep it open.)*

3.  Open **MongoDB Compass** and connect to:
    `original connection string`: `mongodb://localhost:27017`

### Option B: Check Data via Command Line (On Server)
If you want to quickly check data directly on the server:

1.  **SSH into the server** (see Step 1).
2.  **Enter the MongoDB container**:
    ```bash
    docker exec -it mongodb mongosh
    ```
3.  **Run MongoDB commands**:
    ```javascript
    show dbs        // List databases
    use TodoApp     // Switch to your app's database
    show collections // List collections (e.g., todos, users)
    db.todos.find() // Show all documents in 'todos' collection
    exit            // Exit the shell
    ```

### Option C: One-Liner Check
Run the command remotely without an interactive session.
```bash
ssh -i "path/to/key.pem" ubuntu@54.160.157.188 "docker exec mongodb mongosh TodoApp --eval 'db.todos.find()'"
```

## 5. Infrastructure Management (Terraform)
These commands are run from your local `terraform` directory to manage the AWS infrastructure.

```bash
# Initialize Terraform (download plugins, setup backend)
terraform init

# Apply changes to infrastructure (auto-approve skips the "yes" prompt)
terraform apply -auto-approve

# Force the 'app_server' instance to be destroyed and recreated on the next apply
# Useful if the instance is in a bad state or you need a fresh start
terraform taint aws_instance.app_server
```

## 6. Jenkins Administration
These commands are used manage the Jenkins server on the EC2 instance.

### Get Initial Admin Password
Required for the first time Jenkins setup.
```bash
ssh -i "path/to/key.pem" ubuntu@54.160.157.188 "sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
```

### Manage Jenkins Service
You can SSH into the server first, or run these remotely as shown above.
```bash
# Restart Jenkins (if it's acting up)
sudo systemctl restart jenkins

# Start Jenkins
sudo systemctl start jenkins
# (Alternative using service command)
sudo service jenkins start

# Stop Jenkins
sudo systemctl stop jenkins
```
