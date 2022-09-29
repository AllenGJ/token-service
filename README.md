# token-service
Service for managing tokens

## Setup and launch
Tested on node.js v16.17.1 and npm 8.19.2

Before running, tweak the various configuration options present in the '.env' file as per your preference.

To run the service, run ```npm start``` from within the project directory.

To run the tests, run ```npm test```. Tests are written for all the endpoints present.

### Using Docker
#### Starting the service
1. Run ```docker build -t token-service .``` to build the image.
2. Run ```docker run -d -p 3000:3000 --name token-server token-service``` to create and run the container.
3. The service should be running and listening on port 3000.
#### Tests
To run the tests (visible in the ```test``` folder), you can create a docker image targeted for tests.
1. Run ```docker build -t token-service-test --target test .``` to build the image.
2. Run ```docker run -d --name test-token-server token-service-test``` to create and run the container. 