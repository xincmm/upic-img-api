pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t img .'
      }
    }

    stage('Stop & Remove') {
      steps {
        sh 'docker stop img && docker container rm img'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker run --name img -d -p 3002:3002 img'
      }
    }

  }
}