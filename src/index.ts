import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { Constant } from "../Constant";
import { useExpressServer } from "routing-controllers";
import { Global } from "./support/Global";
import { ConfigService } from "./service/other/misc/ConfigService";
import { Auth } from "./support/authenticate/Auth";
import { ScheduleService } from "./service/other/misc/ScheduleService";
import { Log } from "../node/library/log/Log";
import fs = require('fs');
import { AccountCacheService } from "./service/other/cache/AccountCacheService";
import { Test } from "../test/test";

// Load constructor
Global.Startup()

createConnection().then(async () => {

    Log.message("Database is connected", new Date().string())

    // Load config specialty and state
    ConfigService.instance

    // Create image and tmp image folder
    
    let folder = Constant.image.dir
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    folder = Constant.image.tmp
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }

    // Create express app
    const app = express()

    // Enable cors to support web security
    let cors = require('cors')
    app.use(cors())

    // Create public image api
    app.use(Constant.api.image, express.static(Constant.image.dir))

    // Create public resource api
    app.use(Constant.api.resource, express.static(Constant.public.img))

    // Create public html api
    app.use(Constant.api.html, express.static(Constant.public.html))
    
    // Accept parse json
    app.use(bodyParser.json())

    // Parse date respond
    app.set('json replacer', function (key, value) {
        if (this[key] instanceof Date) {
            value = this[key].gmtWithZoneString();
        }
        return value;
    });

    // Parse request/response
    app.use(function(req, res, next) {
        if (Auth.authenticate(req)) {
            next()
        } else {
            res.status(404).send('Not found')
        }
    })

    if (Constant.host.ssl && !Constant.initDatabase) {
        // Load ssl
        const options = {
            key: fs.readFileSync(Constant.key.domain.key),
            cert: fs.readFileSync(Constant.key.domain.cert),
            ca: fs.readFileSync(Constant.key.domain.ca)
        }
        // Start server with ssl
        const https = require('https')
        https.createServer(options, app).listen(Constant.host.port)
    } else {
        // Start server
        app.listen(Constant.host.port)
    }

    // Load router server
    useExpressServer(app, {
        routePrefix: Constant.api.url,
        controllers: [__dirname + "/controller/**/*ts"]
    })

    // Start initialize cache

    AccountCacheService.instance.initialize()

    // Start service
    ScheduleService.instance.start()

    if (Constant.initDatabase) {
        await Test.createDb()
    }

    // Log success
    Log.message("Startup success", new Date().string())

}).catch(error => Log.error("Startup error", error));
