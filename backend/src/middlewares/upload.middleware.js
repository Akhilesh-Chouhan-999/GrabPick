import multer from 'multer' ; 
import path from 'path' ; 

const storage = multer.diskStorage({

    destination : function(req , file , cb) {
        cb(null , "src/uploads/profile-images") ; 
    } , 

    filename : function(req , file , cb ){

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) ; 
        const extension = path.extname(file.originalname) ; 
        cb(null , "profile-" + uniqueSuffix + extension) ; 
    }

}) ; 



const fileFilter = (req , file , cb ) => {

    const allowedTypes = /jpeg|jpg|png|webp/;

    const isValidExt = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    ) ;
    
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
        cb(null, true);
    }
    
    else {
        cb(new Error("Only image files are allowed!"), false);
    }


} ; 


export const uploadProfileImage = multer({
    storage : storage , 

    limits : {
        fileSize : 5 * 1024 * 1024 
    } , 

    fileFilter : fileFilter 
}) ; 

