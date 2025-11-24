import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        avatar : {
            type: {
                url: String,
                localPath: String
            },
            default: {
                url : `https://placehold.co/200x200`,
                localPath: ""
            }
        },
        username : {
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            trim: true,
            index : true,
        },
        email : {
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            trim: true,
        },
        fullName:{
            type: String,
            trim: true,
        },
        password:{
            required: [true,"Password i required"],
            type: String,
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String
        },
        forgotPasswordToken:{
            type:String
        },
        forgotPasswordExpiry:{
            type:date
        },
        emailVerificationToken:{
            type:String
        },
        emailVerificationExpiry:{
            type:date
        }
    } ,
    {
        timestamps: true
    },

);

export const User = mongoose.model("User",userSchema)