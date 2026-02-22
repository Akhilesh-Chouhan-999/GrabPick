import crypto from 'crypto' ; 
import bcrypt from 'bcrypt';
import AppError from "../errors/app.error.js";
import User from "../models/user.model.js";
import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/jwt.utils.js";




export const registerUser = async (userData) => {

    const { name, phone, password, role , email} = userData;

    if (!name || !phone || !password) {
        throw AppError.notFound(' All fields are required ');
    }

    const existingUser = await User.findOne({
        phone
    });

    if (existingUser) {
        throw new AppError('User already exists ', 409)
    }

    let user;

    try {

        user = await User.create({
            name,
            phone,
            password,
            role: role.toUpperCase() ,
            email 
        });

        const accessToken = generateAccessToken({
            id: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion || 0
        });

        const refreshToken = generateRefreshToken({
            id: user._id
        });


        user.refreshToken = refreshToken;
        await user.save();


        return {

            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role
            },

            accessToken,

            refreshToken

        }


    } catch (error) {


        console.log('Error in the auth.service.js ', error);

        throw AppError.internal('Internal Server Error ');

    }



};

export const loginUser = async (userData) => {

    const { phone, password } = userData;

    if (!phone || !password) {
        throw new AppError('All fields are required', 400);
    }

    const user = await User
        .findOne({ phone })
        .select('+password');

    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }


    const accessToken = generateAccessToken({
        id: user._id,
        role: user.role,
        tokenVersion: user.tokenVersion || 0
    });

    const refreshToken = generateRefreshToken({
        id: user._id
    });

    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

export const logoutUser = async (userData) => {

    const refreshToken = userData.refreshToken;


    if (!refreshToken) {
        throw new AppError.notFound('Refresh token is not found');
    }

    const user = await User.findOne({
        refreshToken
    });

    if (user) {
        user.refreshToken = null;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        user.logoutAt = new Date().toISOString().split('T')[0];
        await user.save();
    }

    return {
        user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            refreshToken: user.refreshToken
        }

    };

};

export const getCurrentUserInformation = async (userData) => {

    const userId = userData;

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError.notFound('User not found');
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

export const changeUserPassword = async (userdata) => {

    const { id , password } = userdata ; 

    if(!id ){
        throw new AppError.notFound('User id not found ' ) ; 
    }

    const user = await User.findById(id) ; 

    if(!user){
        throw new AppError.notFound('User not found') ; 
    }

    if(!password){
        throw new AppError.notFound('Password needed to change') ; 
    }

    user.password = password ;
    await user.save() ;

    return {
        user : {
            id : user._id ,
            password : user.password
        }
    }

} ; 

export const forgotPasswordService = async (phone) => {

    const user = await User.findOne({
                                 phone
                               }) ;

    
    if(!user){
        throw new AppError.notFound('User not found') ; 
    }

    const resetToken = user.createPasswordResetToken() ;

    await user.save({
                        validateBeforeSave : false
                    }) ;


    return {
        resetToken ,
        user 
    }

} ;

export const resetPasswordService = async (token , newPassword ) => {

    const hashedToken = crypto
                            .createHash('sha256')
                            .update(token)
                            .digest('hex') ;

   
    const user = await User.findOne({
        passwordResetToken : hashedToken  ,
        passwordResetExpires : { $gt : Date.now()} 
    }).select("+passwordResetToken +passwordResetExpires")

    if(!user){
        throw new AppError('Tokein is invalid or expired') ; 
    }

    user.password = newPassword ; 
    user.passwordResetToken = undefined ;
    user.passwordResetExpires = undefined ;

    user.tokenVersion += 1 ; 
    user.lastPasswordChangeAt = new Date() ; 

    await user.save() ; 

    
} ;