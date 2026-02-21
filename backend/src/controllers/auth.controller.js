import { loginUser, registerUser } from "../services/auth.service.js"

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


        console.log(result) 

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
        
        
    } catch (error) {
        
    }
}