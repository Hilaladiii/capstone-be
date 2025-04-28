pipeline{
    agent {
      docker{
        image 'node:20.18-alpine' 
        args '-v /var/run/docker.sock:/var/run/docker.sock' 
      }
    }

    options{
      skipDefaultCheckout(true)
    }

    stages{
      stage("checkout")   {
        steps{
            checkout scm
        }
      }
      stage("Install dependencies") {
          steps {
              sh "npm ci --no-optional --no-audit --prefer-offline || npm install --no-optional --no-audit --prefer-offline"
          }
      }
      stage("Testing"){
        steps{
          sh "npm run test:e2e"       
        }
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