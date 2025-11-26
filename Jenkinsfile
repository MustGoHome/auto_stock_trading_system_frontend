pipeline {
    agent none

    environment {
        PROJECT_DIR = "/data"
        PCS_APACHE = "ha_apache"
    }

    stages {
        // [단계 1] 파일 배포 (web01, web02 둘 다 실행됨)
        stage('Deploy to All Nodes') {
            steps {
                script {
                    // 배포할 서버 목록
                    def targetNodes = ['web01.hb05.local', 'web02.hb05.local']
                    
                    targetNodes.each { nodeName ->
                        node(nodeName) {
                            echo "--- [ ${nodeName} ] 배포 시작 ---"
                            checkout scm
                            sh """
                                sudo cp -r * ${PROJECT_DIR}/
                                sudo chown -R apache:apache ${PROJECT_DIR}
                            """
                        }
                    }
                }
            }
        }

        // [단계 2] 서비스 재기동 (web01 한 곳에서만 실행)
        stage('Restart Cluster Resource') {
            agent { label 'web01.hb05.local' } 
            steps {
                sh """
                    echo "--- [ Cluster ] Pacemaker 리소스 재기동 ---"
                    sudo pcs resource restart ${PCS_APACHE}
                """
            }
        }
    }
}