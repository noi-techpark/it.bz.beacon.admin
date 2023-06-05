<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Beacon Südtirol Administration Web Application
The web application to administrate the beacons of the Beacon Südtirol project.

[![CI/CD](https://github.com/noi-techpark/it.bz.beacon.admin/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/it.bz.beacon.admin/actions/workflows/main.yml)

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

- NPM v6.14.15

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
npm install
```

### Run a local server for development including hot-reloads
You can run the application locally (including hot reloads) by executing the following command:
```
npm run serve
```

## Running tests

The unit tests can be executed with the following command:

```
npm run test:unit
```

## Deployment

ToDo: A detailed description about how the application must be deployed.

### Build for production
Use this command to create a release ready for production:
```
npm run build
```
 You'll find the output files in the ./dist folder

## Information

### Support

ToDo: For support, please contact [EMAIL](mailto:EMAIL).

### Contributing

If you'd like to contribute, please follow the following instructions:

https://docs.opendatahub.bz.it/en/latest/guidelines/contributors.html

### Documentation

ToDo: More documentation can be found at [URL](URL).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE 3.0 or later license. See the LICENSE.md file for more information.

