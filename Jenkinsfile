pipeline{
    agent any
    stages{
      stage("checkout")   {
        steps{
            checkout scm
        }
      }
      stage("Testing"){
        sh "npm run test:e2e"       
      }
      stage("Deploying"){
        steps{
          withCredentials([
            file(credentialsId : "credential-capstone",variable:"ENV")
          ]){
            script{
              try{
                sh """                 
                 docker compose down
                 docker compose up -d --env-file ${ENV}
                """
              }
              catch(Exception e){
                echo "Deployment failed ${e.message}"
              }
            }
          }

        }
      }
    }

    post{
      success{
        echo "Deployment completed successfully"
      }
      failure{
        echo "Deployment failed. Check logs for details"
      }
      always{
        cleanWs()
      }
    }
}