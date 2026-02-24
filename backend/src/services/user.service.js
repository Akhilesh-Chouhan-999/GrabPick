import AppError from "../errors/app.error.js";
import User from "../models/user.model.js";
import fs from 'fs' ;
import path from 'path' ; 


export const getUserByIdService = async (id) =>  {

    const user = await User.findById(id);


    if (!user) {
        throw new AppError.notFound("User not found");
    }


    return {

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profileImage: user.profileImage,
            isVerified: user.isVerified
        }

    };

};


export const updateProfileService = async (id, userData) => {

    const allowedProfileFields = ["name", "email", "phone"];

    const filteredData = {};

    allowedProfileFields.forEach((key) => {

        if (userData[key] !== undefined) {
            filteredData[key] = userData[key];
        }

    });


    if (!id)
        throw new AppError.notFound('User not found');


    const user = await User
        .findByIdAndUpdate(id,
            filteredData,
            { new: true, runValidators: true });

    if (!user)
        throw new AppError.notFound('User not found');


    return {

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        }

    };


};



export const updateAvatarService = async (id, file) => {

    if (!file) {
        throw new AppError.badRequest('No image uploaded');
    }

    const user = await User.findById(id);

    if (!user) 
    throw new AppError.notFound('User not found');

    try {

        if (user.profileImage && typeof user.profileImage === 'string') {

            const prev = user.profileImage.replace(/\\/g, '/');

          
            if (prev.includes('src/uploads')) {

                const fullPath = path.resolve(prev);

                await fs.promises.unlink(fullPath).catch(() => { });
            }

        }

    }
    
    catch (err) {
        // ignore delete errors
    }

    const savedPath = file.path ? file.path.replace(/\\/g, '/') : `src/uploads/profile-images/${file.filename}`;

    user.profileImage = savedPath;

    await user.save();

    return {
        user: {
            id: user._id,
            profileImage: user.profileImage
        }
    };

};

export const deleteAccountService = async ( id ) => {

    if(!id)
    throw new AppError("Id is not given" , 400) ;

    const user = await User.findByIdAndDelete(id) ;


    return {

        user : {
            id : user._id , 
            name : user.name 
        }
    }
}