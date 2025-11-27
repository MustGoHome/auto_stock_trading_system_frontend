pipeline {
    agent none

    environment {
        PROJECT_DIR = "/data"
        PCS_APACHE  = "ha_apache"
    }

    stages {
        stage('Deploy to All Nodes') {
            matrix {
                axes {
                    axis {
                        name 'TARGET_NODE'
                        values 'web01.hb05.local', 'web02.hb05.local'
                    }
                }
                
                agent { label "${TARGET_NODE}" }

                stages {
                    stage('Checkout & Copy') {
                        steps {
                            echo "--- [ ${TARGET_NODE} ] 배포 시작 ---"
                            
                            echo "[ START ] Git 저장소에서 코드 가져오기"
                            checkout scm

                            sh """
                                echo "[ START ] Workspace의 파일 복사 (${TARGET_NODE})"
                                sudo cp -r * ${PROJECT_DIR}/
                                
                                echo "[ START ] 배포 디렉터리 권한 수정"
                                sudo chown -R apache:apache ${PROJECT_DIR}
                            """
                        }
                    }
                }
            }
        }

        stage('Restart Apache Process') {
            agent { label 'web01.hb05.local' } 
            steps {
                sh """
                    echo "[ START ] Pacemaker Apache Resource 재기동"
                    sudo pcs resource restart ${PCS_APACHE}
                """
            }
        }
    }
}
