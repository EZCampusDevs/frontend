pipeline {
    agent any

    stages {

        stage("Build Docker Image") {

            steps {

                dir("frontend/client") {

                    script {

                        docker.build("ezcampus_react_prod", ".")

                    }
                }
            }
        }
    }
    
        
    post {

        always {

            withCredentials([string(credentialsId: 'DISCORD_WEBHOOK_1', variable: 'WEBHOOK_URL')]) {

                discordSend(
                            description: currentBuild.result, 
                            enableArtifactsList: false, 
                            footer: '', 
                            image: '', 
                            link: '', 
                            result: currentBuild.result, 
                            scmWebUrl: '', 
                            thumbnail: '', 
                            title: env.JOB_BASE_NAME, 
                            webhookURL: "${WEBHOOK_URL}"
                        )
            }
        }
    }
}
