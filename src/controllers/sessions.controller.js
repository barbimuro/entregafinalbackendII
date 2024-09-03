import jwt from "jsonwebtoken";

import { passportCall } from "../middlewares/passportCall.js";
import config from "../config/config.js";
import UserDTOSession from "../DTO/UserParsed.js"

const passportRegister = async (req, res)=>{
    const user = req.user;
    const userSession = { 
        id: user._id,
        name: user.firstName,
        role: user.role
    };
    const userToken = jwt.sign(userSession, config.auth.jwt.SECRET, { expiresIn: "1d" });
    console.log('Setting cookie with token:', userToken);
    res.cookie(config.auth.jwt.COOKIE, userToken, { httpOnly: true }).redirect('/profile');
}

const passportLogin = async (req, res) => {
    const sessionUser = new UserDTOSession(req.user);
  
    const sessionUserObject = { ...sessionUser };

  
    const userToken = jwt.sign(sessionUserObject, config.auth.jwt.SECRET, { expiresIn: "1d" });
    console.log('Setting cookie with token:', userToken);
    res.cookie(config.auth.jwt.COOKIE, userToken, { httpOnly: true }).redirect('/profile');
}

const passportGitHubCallback = async(req, res)=>{
    const userSession = { 
        name:`${req.user.firstName} ${req.user.lastName}`,
        role:req.user.role,
        id:req.user._id
};
const userToken = jwt.sign(userSession, config.auth.jwt.SECRET, { expiresIn: "1d" });
res.cookie(config.auth.jwt.COOKIE, userToken).redirect('/profile');
console.log(userToken); 

}

const passportCallCurrent = async (req, res)=>{
    const token = req.cookies[config.auth.jwt.COOKIE];
    if (!token) {
        return res.status(401).send({ status: "error", error: "Please log in" });
    }
    try {
        const user = jwt.verify(token, config.auth.jwt.SECRET);
        res.send(user);
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).send({ status: "error", error: "Invalid token" });
    }
}

export default {
    passportRegister, passportLogin, passportGitHubCallback, passportCallCurrent
}
