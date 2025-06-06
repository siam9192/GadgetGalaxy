"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = require("passport-facebook");
const config_1 = __importDefault(require("../../config"));
const express_session_1 = __importDefault(require("express-session"));
const router = (0, express_1.Router)();
router.use((0, express_session_1.default)({
    secret: config_1.default.jwt.access_token_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: config_1.default.facebook.id,
    clientSecret: config_1.default.facebook.secret,
    callbackURL: "http://localhost:3000/oauth2/redirect/facebook",
    profileFields: ["id", "displayName", "emails"],
    passReqToCallback: true,
}, function (req, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
router.use(passport_1.default.initialize());
router.use(passport_1.default.session());
router.get("/facebook", passport_1.default.authenticate("facebook", { scope: ["email"] }));
router.get("/oauth2/redirect/facebook", passport_1.default.authenticate("facebook", { failureRedirect: "/login" }), function (req, res) {
    console.log(req.user.accessToken);
    res.redirect("/");
});
const CallbackRouter = router;
exports.default = CallbackRouter;
