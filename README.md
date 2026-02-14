# Laravel_microservice

## Specs
- Gateway Microservice - running Laravel 12,
- Auth Microservice -  - running Laravel 12, sqlite
- IP Management Microservice - running Laravel 12, sqlite
- Frontend Microservice - running NextJS

### Structure
I used the controller - interface - service structure to call on the logics. My approach is to achieve Dependency Inversion, which would capitalize on the interface as a contract. The main goal is to be able to have a flexible service while minimizing the changes when there is a need to change service in the near future.


### Gateray Endpoints

#### Login
Endpoint: POST /api/login
Params: 
{
    "email": "pansy.farrell@example.org",
    "password": "password"
}

==========================================

#### Save new IP 
Endpoint: POST /api/ip-management/ips
Params: 
{
    "address": "192.168.1.1",
    "label": "Home Router",
    "comment": "Main gateway for home network"
}

==========================================

#### Delete IP as per ID
Endpoint: Delete /api/ip-management/ips/{ip-id}
Params: NA

==========================================

#### Get all IPs
Endpoint: GET /ip-management/ips
Params: NA

==========================================

#### Update IP as per ID
Endpoint: PATCH /ip-management/ips/{ip-id}
Params: 
{
    "address": "10.0.0.1",
    "label": "Internal Switch"
}

==========================================

#### Get audit with pagination
Endpoint: POST /audit-logs
Params: 
limit : number
page : number


