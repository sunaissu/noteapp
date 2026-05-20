import passport from "passport";
import express from 'express'
import * as AuthController from '../controller/auth.controller'
import env from "../util/validateEnv";

const router = express.Router()

router.post('/register', AuthController.signup)
router.post('/login', AuthController.login)
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: env.CLIENT_URL + '/login' }),
    function (req, res) {
        res.redirect(env.CLIENT_URL + '/notes');
    });

router.post('/logout', AuthController.logout)

export default router
