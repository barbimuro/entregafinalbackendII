import passport from "passport";
export const passportCall = (strategy) =>{
    return async(req,res,next)=>{
        passport.authenticate(strategy,{ session: false },function(error,user,info){
          
            if(error) return next(error);
 
            req.user = user || null;
            next();
        })(req,res,next);
    }
} 
