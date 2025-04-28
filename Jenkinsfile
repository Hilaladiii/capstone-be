pipeline{
    agent {
      docker{
        image 'node:20.18-alpine' 
        args '-v /var/run/docker.sock:/var/run/docker.sock -v npm-cache:/root/.npm' 
      }
    }
    stages{
      stage("checkout")   {
        steps{
            checkout scm
        }
      }
       stage("Start Dependencies") {
        steps{          
          withCredentials([
            file(credentialsId: "credential-capstone", variable: "ENV")
          ]){
            script{
              sh "cp \$ENV .env" 
              sh "docker compose up -d mysql" 
              sh "sleep 10" 
            }
          }
        }
      }
      stage("Install dependencies") {
          steps{
          sh "rm -rf node_modules || true"
          sh "npm cache clean --force || true"
          sh """
            npm config set registry https://registry.npmjs.org/
            npm config set fetch-retries 3
            npm install --no-fund --legacy-peer-deps
                      
            npx prisma generate
          """
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