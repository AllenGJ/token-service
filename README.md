# token-service
Service for managing tokens

### Setup and running
Clone this project and in the project directory:-
1. Update the various configuration options present in the '.env' file as per your preference.
2. Run ```docker build -t token-service .``` to build the image.
3. Run ```docker run -d -p 3000:3000 --name token-service token-service``` to create and run the container.
4. The service should be running and listening on port 3000.
