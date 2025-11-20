pipeline {
    agent { label 'web01.hb05.local' }
	
	environment {
        PROJECT_DIR = "/data"
		PCS_APACHE = "ha_apache"
    }

    stages {
        stage('Remote Github Checkout') {
            steps {
				echo "[ START ] Git 저장소에서 코드 가져오기"
                checkout scm
            }
        }

        stage('Deploy to Apache Server') {
            steps {
				sh """
                    echo "[ START ] Workspace의 파일 복사"
                    sudo cp -r * ${PROJECT_DIR}/
                    
                    echo "[ START ] 배포 디렉터리 권한 수정"
                    sudo chown -R apache:apache ${PROJECT_DIR}
                """
            }
        }

        stage('Restart Apache Process') {
            steps {
				sh """
				echo "[ START ] Pacemaker Apache Resource 재기동"
				sudo pcs resource restart ${PCS_APACHE}
				"""
            }
        }
    }
}