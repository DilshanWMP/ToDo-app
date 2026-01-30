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
        sh 'docker compose up -d'
        sh 'sleep 10' 
        sh 'docker ps'
      }
    }

    stage('Cleanup') {
      steps {
        sh 'docker compose down'
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
            # We use a single string to avoid indentation issues with HEREDOC in Jenkins
            ssh ubuntu@$DEPLOY_SERVER_IP "export FRONTEND_IMAGE=$FRONTEND_IMAGE; export BACKEND_IMAGE=$BACKEND_IMAGE; docker compose pull; docker compose up -d"

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