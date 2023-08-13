pipeline {
    agent any

    stages {

        stage('Remote Deploy Repository') {
            steps {
                dir("frontend") {
                    sshPublisher(publishers: [
                        sshPublisherDesc(configName: '2GB_Glassfish_VPS', transfers: [
                            sshTransfer(
                                cleanRemote: true, excludes: '', execCommand: '''
cd ~/frontend
chmod +x ./build.sh
./build.sh USE_LOG_FILE
chmod +x ./deploy.sh
./deploy.sh USE_LOG_FILE
''', 
execTimeout: 120000, flatten: false,
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
