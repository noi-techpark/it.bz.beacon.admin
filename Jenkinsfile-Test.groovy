pipeline {
    agent {
        dockerfile {
            filename 'docker/dockerfile-node'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=`id -u jenkins` --build-arg JENKINS_GROUP_ID=`id -g jenkins`'
        }
    }

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        VUE_APP_API_BASE_URL = "https://api.beacon.testingmachine.eu"
        VUE_APP_GOOGLE_MAPS_API_KEY = credentials('beacon-admin-webapp-google-maps-api-key')
    }

    stages {
        stage('Dependencies') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn run test:unit'
            }
        }
        stage('Build') {
            steps {
                sh 'yarn run build'
            }
        }
        stage('Upload') {
            steps {
                s3Upload(bucket: 'it.bz.beacon.webapp-test', acl: 'PublicRead', file: './dist')
            }
        }
    }
}
