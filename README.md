## Teambuilding Project

#### Directory Structure
Backend:
- `src/main/java/controllers` has all the endpoints for both the api and front-end 
- `src/main/java/models` has all the object-table mappings; all the database stuff happens here
- `src/main/resources` has the compiled front-end resources 

Frontend is in the `webapp` folder, all the development with React, etc. goes there.

#### Backend
Dependencies:
- maven
- MySQL

Prerequisites:
- Make sure MySQL is running
- Make sure the application.properties file is properly configured:
    - Do you have the right port?
    - Are the user credentials right (might have to add password)?

Running the backend:
- `mvn spring-boot:run`

#### Frontend
Dependencies:
- npm

Running the website:
- `npm install`
- `webpack`

#### Subsequent Runs
`./scripts/run-all.sh` will compile the front-end, deliver it to Spring MVC, and executes Spring Boot
