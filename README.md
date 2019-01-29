# Beacon Südtirol Web-Administration

## Configure .env file
Make a copy of the .env file and name it ".env.local".
Fill in the URL of the Beacon Südtirol API in the newly created file.

## Install dependencies
Run
```
yarn install
```
to install all needed dependencies.

### Run a local server for development including hot-reloads
Run
```
yarn run serve
```
to let the application run and listen for file changes.

### Create a production release
Run
```
yarn run build
```
to create a release ready for production. You'll find the output files in the ./dist folder

### Execute tests
Run
```
yarn run test:unit
```
to execute the unit tests.
