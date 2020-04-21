const passport = require("passport");
const functions = require("./functions");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();
//Models
const User = require("../models/User");


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    new GoogleStrategy({
        // option for Google strategy
        clientID: process.env.CLIENTID,
        clientSecret: process.env.ClientSecret,
        callbackURL: "/auth/google/redirect"

    }, async(accessToken, refreshToken, profile, done) => {
        try {
            const findCurrentUser = await functions.findUserByEmailGoogle(profile._json.email, User);
            if (!findCurrentUser) {
                const googleUser = {
                    email: profile._json.email,
                    password: profile.id,
                    fullName: profile.displayName
                };
                const creatingUser = await functions.insertData(googleUser, User);
                console.log("User Has been created " + creatingUser.data);
                done(null, creatingUser.data);
            } else {
                console.log("User is regonized: " + findCurrentUser);
                done(null, findCurrentUser);
            }
        } catch (err) {
            console.log("The following error has occured " + err)
        }
    }),
);

passport.use(
    new LocalStrategy({ usernameField: "email" }, async(email, password, done) => {
        try {
            const user = await functions.userLogin(User, email, done);
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    process.nextTick(function() {
                        return done(null, user);
                    });
                    //return done(null, user)
                } else {
                    return done(null, false, { message: "Password Incorect" });
                }
            });
        } catch (e) {
            console.log(e);
        }
    })
); // end of passport use