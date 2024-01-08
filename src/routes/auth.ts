import { Request , Response } from "express";
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as express from 'express'
import { Op } from 'sequelize';
// import * as passport from "passport";
import passport from '../config/passport';
import { responseEncoding } from "axios";
const router = express.Router();


import { validateUserRegistration } from '../middlewares/validateUser';






interface RegisterUserBody {
    username : string, 
    email : string, 
    password : string,
}


// route for registration 
router.post("/register" , validateUserRegistration, async(req : Request<any , any, RegisterUserBody>, res: Response) => {
    
    try{
        const { username , email , password } = req.body;
    
        //checking if the username or email already exists
        const existingUser = await User.findOne({ where : { email }});

        if(existingUser) return res.status(400).json({ error : "Username or email already exists"});
    
        //creating a new user
        const newUser = await User.create({
            username,
            email , 
            password,
        } as User);
    
        res.status(201).json({ success : true, user : newUser , message : "Sucessfully registered a new user "});
    }catch(error){
        console.log("Internal server error : ", error);
        res.status(500).json({ error : "Internal server error : ",});
    }
});


// login route 
router.post("/login" , async(req : Request, res : Response , next: express.NextFunction) => {
    const { email , password } = req.body;  
    passport.authenticate('local', (err: Error, user : any, info: any) => {
        if (err) return res.status(500).json({ error : "Internal server error"});

        if(!user) return res.status(401).json({error : " Invalid email or password "});

        req.logIn(user, (loginErr) => {
            if(loginErr) return res.status(500).json({ error : "Internal server error "});

            return res.status(200).json({ message : "Login Successfull ", user});
        });

    })(req, res, next);
});



// view user profile
router.get("/profile", (req: Request, res : Response) => {
    
    // check if the user is authenticated 
    if(req.isAuthenticated()){
        return res.status(200).json({user : req.user});
    }else{
        return res.status(401).json({ error : "Unauthorized " })
    }
});


//logout
router.post("/logout" , async(req: Request, res: Response) => {
    if (req.isAuthenticated()){
        req.logout((err) => {
            if (err) return res.status(500).json("Error while logging out ");
            return res.status(200).json({ message : "Logout Successful "});
        });
    }else{
        return res.status(401).json({ error : "Unauthorized "});
    }
});



//update user profile
router.put("/update" , async(req : Request, res : Response) => {

    try{
        if(req.isAuthenticated()){
            const { username , email , password } = req.body;
    
            // retrive the authenticated user 
            const authenticatedUser = req.user as User;
    
            //update user details 
            if (username){
                authenticatedUser.username = username;
            }
            if (email) {
                authenticatedUser.email = email;
            }
            if(password ){
                authenticatedUser.password = password;
            }
    
            await authenticatedUser.save();
    
            return res.status(200).json({ success : true, user : authenticatedUser, message : "Successfully update user detail(s) " });
        }else{
            return res.status(401).json({error : "Unauthorized !"});
        }
    }catch(error) {
        console.log("Internal Server Error : ", error);
        return res.status(500).json({ error : "Internal server error " });
    }

});



//delete user 
router.delete("/delete" , async(req: Request, res: Response) => {
    try{
        if(req.isAuthenticated()){
            const authenticatedUser = req.user as User;
    
            //delete user accoutn
            await authenticatedUser.destroy();
    
            req.logout((err : Error) => {
                if(err) return res.status(500).json("Error while logging out ");

                return res.status(200).json({ message : "Account deleted successfully " });
            });
    
        }else{
            return res.status(401).json({ error : "Unauthorized "});
        }
    }catch(error){
        res.status(500).json({ error : "Internal server error "});
    }
});

export default router;
