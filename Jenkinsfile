pipeline {
    agent any

    stages {

        stage('Remote Deploy Repository') {
            steps {

                    sshPublisher(publishers: [
                        sshPublisherDesc(configName: '2GB_Glassfish_VPS', transfers: [
                            sshTransfer(
                                cleanRemote: true, excludes: '', execCommand: '''
chmod +x ./build.sh
./build.sh
''', 
execTimeout: 120000, flatten: false,
                                makeEmptyDirs: true, noDefaultExcludes: false, patternSeparator: '[, ]+',
                                remoteDirectory: './frontend', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '**/*'
                            )
                        ],
                        usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)
                    ])
                }

                echo 'Repository copied'

        }
    }
}
