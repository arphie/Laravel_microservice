# Laravel_microservice

## Specs
- Gateway Microservice - running Laravel 12,
- Auth Microservice -  - running Laravel 12, sqlite
- IP Management Microservice - running Laravel 12, sqlite
- Frontend Microservice - running NextJS

### Structure
I used the controller - interface - service structure to call on the logics. My approach is to achieve Dependency Inversion, which would capitalize on the interface as a contract. The main goal is to be able to have a flexible service while minimizing the changes when there is a need to change service in the near future.
