'use strict';

import Path = require('path');

export const Constant = {
    initDatabase: false,
    host: {
        ssl: true,
        base: "mcs.cloud273.com",
        port: 3002,
    },
    key : {
        domain: {
            key: Path.join(__dirname, '../certificate/com_cloud273_mcs/privkey.pem'),
            cert: Path.join(__dirname, '../certificate/com_cloud273_mcs/fullchain.pem'),
            ca: Path.join(__dirname, '../certificate/com_cloud273_mcs/lets-encrypt-r3.pem')
        }
    },
    sso: {
        host: "http://localhost:4005",
        token: "73NuuN8wPVhScY5+6K7Y4IkRpMSwveojrhingtYirAUw+cRcKNGqRrMGBtYJ21kmS9T3uxsirsMh2rQacrALSQ"
    },
    message: {
        host: "http://localhost:4004",
        token: "0TnZF2TArcBp8r48MwNx1Fl0OMRS03KYbn6aUEMtn5hC9dXJiqa2wO9AvIdCJodHOBjiTF1KNXLpv897OnYQHF",
        email: {
            customerService: "cskh@datchonhanh.com"
        },
        apns: {
            projectId: "mcs-cloud273"
        },
        fcm: {
            projectId: "mcs-cloud273"
        }
    },
    service: {
        loop: 60*10
    },
    image: {
        tmp: Path.join(__dirname, 'image/tmp'),
        dir: Path.join(__dirname, 'image'),
    },
    public: {
        img: Path.join(__dirname, 'src/resource/img'),
        html: Path.join(__dirname, 'src/resource/html')
    },
    api: {
        resource: "/app/resource",
        html: "/app/support",
        image: "/app/image",
        url: '/app/api'
    },
    authenticate: {
        fn: "dung",
        ln: "nguyen",
        bd: "27031984",
        ad: "@0605"
    },
    verifyCode: {
        timeout: 300,
        numTry: 2
    },
    package: {
        block: 300,
        maxVisitTime: 3600
    },
    paging: {
        appointment: 50,
        doctor: 50,
        interval: 100*3600*24
    },
    appointment: {
        createableEnd: 3600*(-18),
        cancelableEnd: 3600*(-6),
        acceptableEnd: 3600*(-6),
        rejectableEnd: 3600*(-6),
        beginableFrom: 3600*(-12),
        beginableEnd: 3600*12,
        finishableEnd: 3600*12
    }
}