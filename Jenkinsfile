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

        stage('Build das Imagens') {
            steps {
                sh '''
                    cd $WORKSPACE
                    docker build -t atlasnow-backend ./Atlasnow-main-back
                    docker build -t atlasnow-frontend ./Atlasnow-frontend-main
                '''
            }
        }

        stage('Exportar e Transferir Imagens') {
            steps {
                sh '''
                    docker save atlasnow-backend | gzip > /tmp/atlasnow-backend.tar.gz
                    docker save atlasnow-frontend | gzip > /tmp/atlasnow-frontend.tar.gz
                    scp -i $KEY_PATH -o StrictHostKeyChecking=no \
                        /tmp/atlasnow-backend.tar.gz \
                        /tmp/atlasnow-frontend.tar.gz \
                        $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/
                '''
            }
        }

        stage('Deploy no Servidor') {
            steps {
                sh '''
                    ssh -i $KEY_PATH -o StrictHostKeyChecking=no \
                        $REMOTE_USER@$REMOTE_HOST "
                            cd $REMOTE_DIR &&
                            docker load < atlasnow-backend.tar.gz &&
                            docker load < atlasnow-frontend.tar.gz &&
                            sudo docker-compose down &&
                            sudo docker-compose up -d
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
