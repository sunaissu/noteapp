import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from './validateEnv'
import * as authService from '../services/auth.service'

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const user = await authService.authenticateWithGoogle({
                googleId: profile.id,
                email: profile.emails?.[0].value as string,
                displayName: profile.displayName as string
            })
            cb(null, user as Express.User)
        } catch (error) {
            cb(error, undefined)
        }
    }
));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user as Express.User);
    });
});
