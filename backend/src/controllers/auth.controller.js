import { sendResetEmail } from "../utils/email.util.js";
import {
     changeUserPassword,
     forgotPasswordService,
     getCurrentUserInformation, 
     loginUser, logoutUser, 
     registerUser, 
     resetPasswordService 
    } from "../services/auth.service.js" ;
import e from "express";


export const register = async (req, res, next) => {
    try {

        const result = await registerUser(req.body);

         res
            .status(201)
            .json(result);

    }

    catch (error) {
        console.log('Error in auth.controller.js' , error) ;
        next(error) ; 
    }
} ; 

export const login = async (req , res , next) => {

    try {

        const result = await loginUser(req.body) ; 

        res
            .status(201)
            .json(result) ; 

    } 
    
    catch (error) {
        
        console.log('Error in auth.login.js ' , error) ; 

        next(error) ; 
    }
} ;

export const logout = async (req , res , next) => {
    
    try {

        const result = await logoutUser(req.body) ; 

        

        res
            .status(201)
            .json(result)  ; 

    } 
    
    catch (error) {
        
        console.log('Error in logout functionality ' , error) ; 

        next(error) ; 
    }
}  ;

export const getCurrentUser = async (req , res , next) => {

    try {

        const result = await getCurrentUserInformation(req.params.id) ; 

        res
            .status(201)
            .json(result) ;
        
    } 
    
    catch (error) {
        
        console.log('Error in getCurrentUser functionality ' , error) ;

        next(error) ;
    }

}; 

export const changePassword = async (req , res , next) => {

    try {
        
        const result = await changeUserPassword(req.body)  ;

        res
            .status(201)
            .json(result)


    } catch (error) {
        
        console.log('Error in change password ' , error) ;

        next(error) ;
    }

} ;


export const forgotPassword = async (req , res , next) => {

    try {
        
        const { phone } = req.body ; 

        console.log(phone)

        const { resetToken , user } = await forgotPasswordService(phone) ;


        await sendResetEmail(user , resetToken) ;

        res
            .status(200)
            .json({
                message : "Reset link sent " 
            })  ; 



    } catch (error) {
        

        console.log('Error in forgotPassword functionality') ;

        next(error) ; 


    }
} ;

export const resetPassword = async (req , res , next) => {
    
    try {
        
        const { token } = req.params ;
        const { password } = req.body ; 


        await resetPasswordService(token , password) ; 

        res
            .status(200)
            .json({
            message : "Password reset successfully "
        }) ; 

    } 
    
    catch (error) {
        console.log('Error in the resetPassword functionality ') ;
        next(error) ; 
    }
} ;

