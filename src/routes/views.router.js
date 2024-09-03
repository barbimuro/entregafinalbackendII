import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/',(req,res)=>{
    res.render('Home');
})

router.get('/register',(req,res)=>{
    res.render('Register');
})

router.get('/login',(req,res)=>{
    res.render('Login');
})

router.get('/profile',passport.authenticate('current',{session:false}),(req,res)=>{
    console.log(req.user);
    res.render('Profile')
})





export default router;