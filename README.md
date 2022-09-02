# ft_transcendence
Final project from the 42 core curriculum

## dev stuff

### npm scripts

In appropriate folder run 'npm run <script>'

#### In back_end
* prisma:dev:deploy - migrates changes to database and prisma structure
* db:dev:rm - removes the database container and its associated volumes
* db:dev:up - starts only the database container
* db:dev:restart - rm and up
* nest:dev:rm - removes the nestJS container and its associated volumes
* nest:dev:up - starts only the nestJS container
* nest:dev:restart - rm and up
* backend:dev:rm - db:dev:rm and nest:dev:rm
* backend:dev:up - starts nestJS and database containers
* backend:dev:restart - rm and up

## Setup

Copy any template.env file as .env in the same location, and then populate it with appropriate values for the variables.
npm install in both front_end and back_end folders, then npm run prisma:dev:deploy in the back_end folder, then docker-compose in the root directory.
Frontend will be available at localhost:3000, backend at localhost:3333.
For database gui client run npx prisma studio in the backend folder, then access it at url seen on the consoler.
