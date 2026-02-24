import { deleteAccountService, getUserByIdService, 
        updateAvatarService, 
        updateProfileService } 
        from "../services/user.service.js";

export const getUserByIdController = async (req , res , next ) => {

    try {
        
        const id = req.params.id ; 

        const result = await getUserByIdService(id) ; 


        console.log(result)

        res
            .status(200)
            .json(result) ; 

    }
    
    catch (error) {
        
        console.log('Error in the getuserbyidcontroller user.controller.js ')
        next(error) ;
    }
} ;

export const updateProfileController = async (req , res , next) => {

    try {

        const id = req.user.id ; 
        
        const result = await updateProfileService(id , req.body) ; 

        res
            .status(200)
            .json(result) ; 

    } 
    
    catch (error) {
        next(error) ; 
    }


} ;

export const updateAvatarController = async (req , res , next) => {

 try {
    
   const id = req.user.id ; 

    const result =  await updateAvatarService(id , req.file)  ;

    return res
              .status(201)
              .json(result) ; 

 }
 
 catch (error) {
    
    next(error) ; 
 }

};

export const deleteAccountController = async (req , res , next) => {

    try {
        
        const id = req.user.id ; 

        const result = await deleteAccountService(id) ; 


        res
            .status(200)
            .json(result) ; 


    } catch (error) {
       
         next(error) ; 

    }
    
} ;


