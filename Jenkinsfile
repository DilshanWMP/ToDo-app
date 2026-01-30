pipeline {
  agent any

  environment {
    DOCKER_HUB_USER = 'dilshanwmp'
    FRONTEND_IMAGE = 'dilshanwmp/todo_app_frontend'
    BACKEND_IMAGE = 'dilshanwmp/todo_app_backend'
    DEPLOY_SERVER_IP = '54.160.157.188'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Push Backend') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "Logging in to Docker Hub..."
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            echo "Building Backend..."
            # CHANGE './backend' if your folder is named differently
            docker build -t $BACKEND_IMAGE:latest ./todoappbackend
            
            echo "Pushing Backend..."
            docker push $BACKEND_IMAGE:latest
          '''
        }
      }
    }

    stage('Build & Push Frontend') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "Logging in to Docker Hub..."
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            echo "Building Frontend..."
            # CHANGE './frontend' if your folder is named differently
            docker build -t $FRONTEND_IMAGE:latest ./todoappfrontend
            
            echo "Pushing Frontend..."
            docker push $FRONTEND_IMAGE:latest
          '''
        }
      }
    }

    stage('Test Run with Compose') {
      steps {
        // Pre-cleanup: Kill ANY container using our ports (5000, 5173, 27017)
        sh 'docker ps -q --filter "publish=5000" | xargs -r docker rm -f'
        sh 'docker ps -q --filter "publish=5173" | xargs -r docker rm -f'
        sh 'docker ps -q --filter "publish=27017" | xargs -r docker rm -f'
        
        sh 'docker rm -f mongodb || true'
        sh 'docker compose down || true' 
        sh 'docker compose up -d'
        sh 'sleep 10' 
        sh 'docker ps'
      }
      post {
        always {
          sh 'docker compose down || true'
          sh 'docker rm -f mongodb || true'
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(['ec2-server-key']) {
          sh '''
            echo "Deploying to $DEPLOY_SERVER_IP..."
            
            mkdir -p ~/.ssh
            chmod 700 ~/.ssh
            echo "StrictHostKeyChecking no" > ~/.ssh/config
            
            scp docker-compose.yml ubuntu@$DEPLOY_SERVER_IP:/home/ubuntu/docker-compose.yml
            
            # SSH into server and update containers
            # Force remove mongodb to prevent conflicts
            # Inject dynamic URLs based on server IP
            ssh ubuntu@$DEPLOY_SERVER_IP "export FRONTEND_IMAGE=$FRONTEND_IMAGE; export BACKEND_IMAGE=$BACKEND_IMAGE; export VITE_API_BASE_URL=http://$DEPLOY_SERVER_IP:5000/api; export FRONTEND_URL=http://$DEPLOY_SERVER_IP:5173; docker rm -f mongodb || true; docker compose pull; docker compose up -d"

          '''
        }
      }
    }
  }

  post {
    failure {
      echo '❌ Todo App Build Failed!'
    }
    success {
      echo '✅ Todo App Build and Push Succeeded!'
    }
  }
}