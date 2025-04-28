pipeline{
    agent {
      docker{
        image 'docker:latest'
        args '-v /var/run/docker.sock:/var/run/docker.sock --user root'
      }
    }
    stages{
      stage("checkout")   {
        steps{
            checkout scm
        }
      }          
      stage("Testing"){
        steps{
          withCredentials([
            file(credentialsId : "credential-capstone-test",variable:"ENV_TEST")
          ]){
            script {
              sh"""
                cp $ENV_TEST .env.test
                docker compose --env-file .env.test -f docker-compose.test.yaml up --abort-on-container-exit --exit-code-from server_test
                docker compose -f docker-compose.test.yaml down
              """       
            }
          }
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
                 cp $ENV .env
                 docker compose down
                 docker compose --env-file .env up -d
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