import { Router } from "express";
import passport from 'passport'
import jwt from "jsonwebtoken";

import { passportCall } from "../middlewares/passportCall.js";
import config from "../config/config.js";
import { executePolicies } from "../middlewares/policies.js";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router()

router.post('/register',passportCall('register'), executePolicies(['PUBLIC']),sessionsController.passportRegister);

router.post('/login',passportCall('login'), executePolicies(['PUBLIC']), sessionsController.passportLogin)

router.get('/failureRegister', executePolicies(['PUBLIC']), (req, res) => {
    res.send({ status: "error", error: "Failed register attempts" });
});
router.get('/failureLogin', executePolicies(['PUBLIC']), (req, res) => {
    res.send({ status: "error", error: "Failed login attempts" });
});
router.get('/github', passportCall('github'), executePolicies(['PUBLIC']));

router.get('/githubcallback',passportCall('github'), executePolicies(['PUBLIC']), sessionsController.passportGitHubCallback);

router.get('/current', passportCall('current'), executePolicies(['PUBLIC']), sessionsController.passportCallCurrent)

router.get('/logout', executePolicies(['PUBLIC']), (req, res) => {
    res.clearCookie(config.auth.jwt.COOKIE).redirect('/login');
});


export default router;