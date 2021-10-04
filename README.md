# REMAIN TASK

1. Reminder service

2. Prescription - ICD - Drug list

3. Cache doctor rating, package next working time, sort doctor query by name, rating, location

# IMPROVEMENT SERVICE

1. Log service

2. Multi-language service


# NOTE

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
