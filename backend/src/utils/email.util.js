import nodemailer from 'nodemailer' ;
import { BASE_URL, EMAIL, EMAIL_PASSWORD } from '../config/env.js';

export const sendResetEmail = async (user , token) => {

    const resetURL = `${BASE_URL}/api/v1/auth/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
        service : 'gmail' ,
        auth : {
            user : EMAIL ,
            pass : EMAIL_PASSWORD
        }
    }) ;

    console.log(user.email) ; 

    await transporter.sendMail({
        to : user.email  ,
        subject : "Password Reset" ,
        text : `Reset your password using this link: ${resetURL}`
    })
}