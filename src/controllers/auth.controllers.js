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

    
    const mailGenContent = emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
    );

    

    await sendEmail({
        email: user?.email,
        subject: "please verify your email",
        mailgenContent: mailGenContent // Pass the variable we just created
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
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


const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(400, " email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});


export { registerUser , login }