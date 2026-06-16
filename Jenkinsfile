pipeline {
    agent any

    environment {
        REMOTE_USER = 'ubuntu'
        REMOTE_HOST = '18.230.189.53'
        REMOTE_DIR  = '/home/AtlasNow-main'
        KEY_PATH    = '/root/.ssh/projeto-key.pem'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'principal',
                    url: 'https://github.com/Francine13/AtlasNow.git'
            }
        }

        stage('SCP Transfer') {
            steps {
                sh '''
                    scp -i $KEY_PATH -o StrictHostKeyChecking=no -r \
                        $WORKSPACE/. \
                        $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR
                '''
            }
        }

        stage('SSH Deploy') {
            steps {
                sh '''
                    ssh -i $KEY_PATH -o StrictHostKeyChecking=no \
                        $REMOTE_USER@$REMOTE_HOST "
                            cd $REMOTE_DIR &&
                            sudo docker-compose down &&
                            sudo docker-compose up -d --build &&
                            sudo docker exec atlasnow-backend npx knex migrate:latest
                        "
                '''
            }
        }

        stage('Verificação') {
            steps {
                sh '''
                    ssh -i $KEY_PATH -o StrictHostKeyChecking=no \
                        $REMOTE_USER@$REMOTE_HOST "
                            sudo docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
                        "
                '''
            }
        }
    }

    post {
        success {
            echo 'Deploy da AtlasNow realizado com sucesso!'
        }
        failure {
            echo 'Falha no deploy. Verifique os logs acima.'
        }
    }
}
