import { Request ,Response } from "express";
import { User } from "../models/User";
import { PasswordReset } from "../models/PasswordReset";
const express = require('express');
const router = express();
require('dotenv').config();

import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service : 'Gmail',
    secure : true, 
    port : 465,
    host : 'gmail',
    auth : {
        user : process.env.EMAIL_USERNAME,
        pass : "crad bwcu rvvn jmlm",
    },
});




router.post('/forgot-password', async(req : Request, res: Response)=> {
    try{
        const { email } = req.body;
    
        const user = await User.findOne({ where : { email }});
    
        if ( !user ) return res.status(404).json({ error : " User not found !"});
    
        const resetToken = await User.generatePasswordResetToken(user);
        
        const resetLink = `http://localhost:3000/api/users/forgot-password/:${resetToken}`;
    
        await transporter.sendMail({
            to : user.email,
            subject : "Reset Your Password ",
            text : `Hello ${user.username}, Please follow the link below in order to reset your password . Link : ${resetLink}`,
        });
        res.status(200).json({ message: "Password reset email sent successfully ."});
    }catch(error){
        console.log("internal server error : ", error);
        res.status(500).json({ error : `Internal Server Error : ${error}`});
    }

});


router.post("/forgot-password/:token/e", async(req : Request, res: Response)=>{
    try{
        const { token } = req.params;
        const { newPassword } = req.body;
    
        console.log(" the reset token is : ", token);
        
        const passwordReset = await PasswordReset.findOne({ where : { resetPasswordToken : token } });
        console.log(passwordReset);
    
        if(!passwordReset || passwordReset.resetPasswordExpires < new Date()){
            return res.status(401).json({ error : "Invalid or expired Token "});
        }
        // find the user by password reset record 
        const user = await User.findByPk(passwordReset.userId);
    
        if(!user) return res.status(404).json({ error: "User not found !"});
    
        // update the new password : 
        user.password = newPassword;
        
        //removing the password reset record 
        await passwordReset.destroy();
    
        //saving user with new password 
        await user.save();
    
        res.status(200).json({ message : "Password reset Sucessful !"});
    }catch(error){
        console.log('Internal server error : ', error);
        res.status(500).json({error : `Interna; Server Error : ${error}`});
    }

});



export default router;