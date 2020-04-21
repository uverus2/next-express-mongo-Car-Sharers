require("dotenv").config();

const express = require("express");
const next = require("next");

// Routes
const routes = require("./routes/routes");
const api = require("./routes/api-routes");
const auth = require("./routes/auth-routes");

// Middleware
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const passport = require("passport");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const morgan = require("morgan");
const passportSetUp = require("./config/passportSetUp");
const schedule = require('node-schedule');

const { changeStatus } = require("./config/functions");
const Trips = require("./models/Trips");

// Initialize Next app 
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const db = process.env.DBURL + process.env.DBNAME;
    mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() => console.log("DB Connected")).catch(err => console.log(err));

    // general middlware
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(morgan("dev"));
    server.use(helmet());
    server.use(cookieParser());
    // use the session
    server.use(session({
        secret: process.env.SECRET,
        resave: false,
        sameSite: true,
        saveUninitialized: false,
        rolling: true,
        store: new MongoStore({
            url: process.env.DBURL + process.env.DBNAME,
            touchAfter: 24 * 3600,
            autoRemove: 'interval',
            autoRemoveInterval: 24
        }),
        cookie: {
            sameSite: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    }));

    //Passport middleware
    server.use(passport.initialize());
    server.use(passport.session());

    //custom routes
    server.use(routes);
    server.use("/api", api);
    server.use("/auth", auth);



    const j = schedule.scheduleJob({ hour: 00, minute: 00 }, function() {
        changeStatus(Trips);
        console.log("Spider");
    });

    // handling everything else with Next.js
    server.get("*", handle);

    server.listen(process.env.PORT, () => {
        console.log(`Application listening http://localhost:${process.env.PORT}`);
    });
}).catch(e => {
    console.log(e);
});