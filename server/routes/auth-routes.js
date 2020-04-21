const express = require("express");
const authRoutes = express.Router();

const passport = require("passport");

authRoutes.get("/google", passport.authenticate("google", {
    // what we want to retrive from the user's profile
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

authRoutes.get("/google/redirect", passport.authenticate("google", { session: true }), (req, res) => {
    // handle with passport
    req.logIn(req.user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
    });
});

authRoutes.post("/login", passport.authenticate("local", { session: true }), (req, res) => {
    // handle with passport
    req.logIn(req.user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
    });
});

authRoutes.post("/update-session", (req, res) => {
    const name = req.session.passport.user;
    name.gender = req.body.gender;
    name.interests = req.body.interests;
    req.session.save((err) => {
        console.log(err);
    });
    console.log(name);
    res.end();
});

authRoutes.post("/edit-session", (req, res) => {
    const name = req.session.passport.user;
    name.gender = req.body.gender;
    name.interests = req.body.interests;
    name.email = req.body.email;
    name.fullName = req.body.fullName;
    req.session.save((err) => {
        console.log(err);
    });
    console.log(name);
    res.end();
});

authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});


module.exports = authRoutes;