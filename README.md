# Beacon Südtirol Administration Web Application
 
The web application to administrate the beacons of the Beacon Südtirol project.

## Table of contents

- [Getting started](#getting-started)
- [Running tests](#running-tests)
- [Deployment](#deployment)
- [Information](#information)

## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- [YARN](https://yarnpkg.com/)

### Source code

Get a copy of the repository:

```bash
git clone https://github.com/idm-suedtirol/beacon-suedtirol-administration-webapp.git
```

Change directory:

```bash
cd beacon-suedtirol-administration-webapp/
```

### Configure .env file
Make a copy of the .env file and name it ".env.local".
Fill in the URL of the Beacon Südtirol API in the newly created file.
The same configuration can be made with environment variables.

### Install dependencies
To install all needed dependencies execute this command:
```
yarn install
```

### Run a local server for development including hot-reloads
You can run the application locally (including hot reloads) by executing the following command:
```
yarn run serve
```

## Running tests

The unit tests can be executed with the following command:

```
yarn run test:unit
```

## Deployment

ToDo: A detailed description about how the application must be deployed.

### Build for production
Use this command to create a release ready for production:
```
yarn run build
```
 You'll find the output files in the ./dist folder

## Information

### Support

ToDo: For support, please contact [EMAIL](mailto:EMAIL).

### Contributing

If you'd like to contribute, please follow the following instructions:

- Fork the repository.

- Checkout a topic branch from the `development` branch.

- Make sure the tests are passing.

- Create a pull request against the `development` branch.

### Documentation

ToDo: More documentation can be found at [URL](URL).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE 3.0 or later license. See the LICENSE.md file for more information.

