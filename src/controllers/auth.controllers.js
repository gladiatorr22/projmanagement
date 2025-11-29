import { User } from '../models/user.models.js'
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Apierror } from '../utils/api-error.js';
import { sendEmail , emailVerificationMailgenContent } from '../utils/mail.js';

const generateAccessTokenAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new Apierror(500,"something went wrong")
    }
}



const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password,role} = req.body

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser){
        throw new Apierror(409,"user with email or username already exists",[])
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
    })

    const {unhashedToken,hashedToken,tokenExpiry} = user.generateTemporaryToken()
    
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})

    console.log("DEBUG MAIL CONTENT:", JSON.stringify(mailGenContent, null, 2));
    await sendEmail(
        {
            email: user?.email,
            subject: "please verfy your email",
            mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
            )
        }
    );

    const createdUser = await User.findById(user._id).select(
        "-password, -refreshToken , -emailVerificationToken , -emailVerificationExpiry"
    )

    if(!createdUser){
        throw new Apierror(500,"something went wrong while registering the user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user:createdUser},
                "user registered successfully"
            )
        )

})

export{registerUser}