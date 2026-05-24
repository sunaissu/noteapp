import passport from "passport";
import express from 'express'
import * as AuthController from '../controller/auth.controller'
import env from "../util/validateEnv";
import { requireAuth } from "../util/auth";
import rateLimit from "express-rate-limit";

const router = express.Router()

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: { error: 'Too many requests, please try again after a while.' },
})

router.post('/register', limiter, AuthController.signup)
router.post('/login', limiter, AuthController.login)
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: env.CLIENT_URL + '/login' }),
    function (req, res) {
        res.redirect(env.CLIENT_URL + '/notes');
    });

router.post('/logout', requireAuth, AuthController.logout)

export default router
