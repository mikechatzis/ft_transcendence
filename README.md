# ft_transcendence
Final project from the 42 core curriculum. Full stack development of a website to play Pong with your friends, from scratch.
Stack: frontend: React (typescript), backend: nestjs. Database: PostgresSQL
Deployment: Run "docker compose up", in the root of the repository

## dev stuff

### npm scripts

In appropriate folder run 'npm run <script>'

#### In back_end
* prisma:dev:deploy - migrates changes to database and prisma structure
* db:dev:rm - removes the database container and its associated volumes
* db:dev:up - starts only the database container
* db:dev:restart - rm, up and deploy
* nest:dev:rm - removes the nestJS container and its associated volumes
* nest:dev:up - starts only the nestJS container
* nest:dev:restart - rm and up
* backend:dev:rm - db:dev:rm and nest:dev:rm
* backend:dev:up - starts nestJS and database containers
* backend:dev:restart - rm and up

## Setup

Copy any template.env file as .env in the same location, and then populate it with appropriate values for the variables, then run docker-compose in the root directory.
Frontend will be available at localhost:3000, backend at localhost:3333.
For database gui client run 'npx prisma studio' in the backend folder, then access it at url seen on the console (you might need to install prisma with npm first).
Run 'npm run prisma:dev:deploy' with the database active after changes to the prisma schema
