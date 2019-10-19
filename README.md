## Teambuilding Project

#### Directory Structure
Backend:
- `src/main/java/controllers` has all the endpoints for both the api and front-end 
- `src/main/java/models` has all the object-table mappings; all the database stuff happens here
- `src/main/resources` has all the static content and configs -- no need to touch this too much 

Frontend is in the `webapp` folder, all the development with React, etc. goes there.

#### Backend
Dependencies:
- maven

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
