import mongoose, { Schema } from 'mongoose' ; 
import bcrypt from 'bcrypt' ;

const userSchema  = new Schema({

    name : {
        type : String , 
        required  : [true , 'Name is required'] ,
        trim      : true , 
        minLength : [ 3 ,  "Name must be at least 3 characters"] ,
        maxLength : [30 ,  "Name cannot exceed 30 characters"] ,
        validate  : {
                    validator: function (value) {
                     return /^[a-zA-Z\s]+$/.test(value);
                    },
                    message: "Name can only contain letters and spaces"
                    }
    } ,

    email : {
        type        : String ,
        trim        : true ,
        minLength   : [5 , 'Email must have atleast 5 characters'] ,
        maxLength   : [40 , 'Email cannot exceed 40 character'] ,
        unique      : true ,
        sparse      : true ,
        required    : false ,
        match       : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/]
    } ,


    phone : {
        type : String ,
        required  : [true , 'Phone number is required'] ,
        unique    : [true , ' Phone number must be unique'] ,
        index : true , 
        trim      : true ,
        minLength : [10 , 'Phone number must be atleast 10 character'] ,
        maxLength : [15 , 'Phone number cannot exceed 15 characters'] ,
        match     : [/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"] ,
        
    } ,


    password : {
        type      : String ,
        required  : [true , 'Password is required '] ,
        minLength : [ 8 , 'Password cannot be less than 8'] ,
        match     : [
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                        "Password must contain uppercase, lowercase, number and special character"
                    ],
        select    : false 
        
    } ,

    refreshToken: {
        type    : String,
        select  : false,
        default : null
    },

    role : {
        type : String , 
        enum : [ 'ORGANIZER' , 'USER'] ,
        default : 'USER' ,
        upperCase : true
    } ,

    profileImage : {
        type     : String ,
        default  : null 
    } ,

    isVerified  : {
        type    : Boolean ,
        default : false 
    } ,

     otp       : {
       type    : String , 
       select  : false 
    } , 

    otpExpires : {
          type : Date ,
        select : false 
    }


}, {
    timestamps : true
}) ;
userSchema.pre('save', async function () {

    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

const User = mongoose.model('User' , userSchema) ; 
export default User ;
