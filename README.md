## Description

Repository that represent a demonstration of access and refresh token

## Environment variables

Need to create .env file in root of the project, once the project is cloned.

```bash
AT_SECRET -> secret for access token
AT_EXPIRES_IN -> expires time for access token
RT_SECRET -> secret for refresh token
RT_EXPIRES_IN -> expires time for refresh token
APP_PORT -> port for application, default is 3000
DATABASE_URL -> connection string for database
```

## Note

Need to have database server. This project using mysql. Since project using Prisma for ORM, you can use any database by your choice that Prisma support. Supported database you can found on following link: https://www.prisma.io/docs/reference/database-reference/supported-databases

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Running the migration

```bash
# migrate data from schema to database
$ npm run prisma:migrate

# create new migration script
$ npm run prisma:create
```

## Swagger

```bash
http://{host}:{port}/api/#/
```
