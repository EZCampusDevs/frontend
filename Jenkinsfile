pipeline {
    agent any

    stages {

        stage('Remote Deploy Repository') {
            steps {
                dir("frontend") {
                    sshPublisher(publishers: [
                        sshPublisherDesc(configName: "${SSH_SERVER}", transfers: [
                            sshTransfer(
                                cleanRemote: true, excludes: '', execCommand: '''
cd ~/frontend
chmod +x ./build.sh
./build.sh USE_LOG_FILE
chmod +x ./deploy.sh
./deploy.sh USE_LOG_FILE
''', 
execTimeout: 300000, flatten: false,
                                makeEmptyDirs: true, noDefaultExcludes: false, patternSeparator: '[, ]+',
                                remoteDirectory: 'frontend', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '**/*'
                            )
                        ],
                        usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)
                    ])
                }
            }
        }
    }
    
        
    post {
        always {
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
                        webhookURL: "${DISCORD_WEBHOOK_1}"
                    )
        }
    }
}
