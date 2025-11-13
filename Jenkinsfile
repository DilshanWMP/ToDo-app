pipeline {
  agent any

  environment {
    DOCKER_HUB_USER = 'dilshanwmp'
    FRONTEND_IMAGE = 'dilshanwmp/todo_app_frontend'
    BACKEND_IMAGE = 'dilshanwmp/todo_app_backend'
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