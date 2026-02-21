import bcrypt from 'bcrypt';
import AppError from "../errors/app.error.js";
import User from "../models/user.model.js";
import {
            generateAccessToken, 
            generateRefreshToken } from "../utils/jwt.utils.js";


export const registerUser = async (userData) => {

    const { name, phone, password, role } = userData;

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
            role: role.toUpperCase()
        });

        const accessToken = generateAccessToken({
            id: user._id,
            role: user.role
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
        role: user.role
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


    const refreshToken = userData ; 

    if(!refreshToken){
        throw new AppError.notFound('Refresh token is not found')  ; 
    }

    const user = await User.findOne({
                            refreshToken 
                                    });

    if(user){
        user.refreshToken = null ;
        await user.save() ; 
    }

    res.status(201).json({
        message : " User LoggedOut Successfully! " ,
        success : true 
    }) ; 

    
} ;