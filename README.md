# ft_transcendence
Final project from the 42 core curriculum

## dev stuff

### npm scripts

In appropriate folder run 'npm run <script>'

#### in back_end
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
