# Content

- This repository includes web service (REST API) for all MCS application written in nodejs with Express and TypeORM 

- Api: https://github.com/cloud273/mcs-server/blob/main/doc/api.yaml

- To run this server, you need to run other services 
    + Account service: https://github.com/cloud273/mcs-sso
    + Message service: https://github.com/cloud273/mcs-message

# Todo

1. Reminder service

2. Prescription - ICD - Drug list

3. Support multi-language service


# Develop

## Git

### Add submodule

`
git submodule add https://github.com/cloud273/node-utility.git node
`

### Main

`
git clone --recurse-submodules https://github.com/cloud273/mcs-server.git
`

`
git pull --recurse-submodules
`

### Sub-modules

`
git pull origin HEAD:master
`

`
git push origin HEAD:master
`


## Update all packages

`
npm i -g npm-check-updates
`

`
ncu -u
`

`
npm install
`
    
## Convert p12 to pem to read information

`
openssl pkcs12 -in doctor.p12 -out doctor.pem -nodes -clcerts
`

`
openssl pkcs12 -in patient.p12 -out patient.pem -nodes -clcerts
`
