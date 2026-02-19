import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"


const generateAccessToken = async (id)=>{
try{
    const user = await userModel.findById(id)
    if (!user) throw new Error("User not found")
    const accessToken = jwt.sign(
        {id : user._id} , 
        process.env.ACCESS_TOKEN_SECRET , 
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )

    return accessToken

}catch(error){
    console.error("Error in generateRefreshAndAccessToken:", error.message);
}

}


const  login  = async(req , res)=>{
    try{
        const {email , password} = req.body
        if(!email || !password) return res.status(400).json({success : false , message : "fields are required"})
        const user = await userModel.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        const isCorrect =  await user.isPasswordCorrect(password)
        if(!isCorrect) return res.status(400).json({success : false , message : "inCorrect Password"})
        const accessToken = await generateAccessToken(user._id)
    
        return res.status(201).json({
        success: true,
        message: "User login successfully",
        token : accessToken , 
        userData : user
        });

    }catch(error){
        console.error("Error in login", error.message);
        return res.status(401).json({success : false , message : "error in login user"})
        
    }
}

const  register = async(req , res)=>{
    try{
        const {email , password , username} = req.body
        if(!email || !password || !username) return res.status(400).json({success : false , message : "fields are required"})
        const user = await userModel.findOne({email})
        if (user) return res.status(400).json({success : false , message : "user already exist"})

        const userCreated = await userModel.create({
            email , password , username
        })

       const accessToken =  await generateAccessToken(userCreated._id)

       res.status(201).json({success : true , message : "user created successfully" , token : accessToken})
    
    }catch(error){
        console.error("Error in registering user", error.message);
        return res.status(401).json({success : false , message : "error in creating user"})
    }
}

const  getUser  = async(req , res)=>{
try{
   const user =  await userModel.findById(req.user._id)
   if(!user) return res.status(401).json({success : false , message : "error in getuser"})
    return res.status(201).
    json({success : true , message : "user fetched" , user})
}catch(error){
      console.log("error in getting user =>" , error.message)
     return res.status(401).json({success : false , message : "error in getuser"})
}
}

const  updateProfile = async(req , res)=>{
 try{
    const {username ,  profileImage  } =  req.body
   const user = await userModel.findById(req.user._id)
   if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    if(profileImage) user.profileImage = profileImage
    if(username) user.username = username

    await user.save()

    return res.status(200).
    json({success : true , message : "user profile updated" , user})

}catch(error){
    console.log("error in updating user profile =>" , error.message)
    return res.status(400).
    json({success : false , message : "error in updating profile"})
}
}

const  changePassword  = async(req , res)=>{
  try{
    const {currentPassword , newPassword} = req.body

    if(!newPassword || !currentPassword) return res.status(400).json({success : false , message : "fields are required"})

    const user = await userModel.findById(req.user._id).select("+password")
    const isCorrect = await user.isPasswordCorrect(currentPassword)

    if(!isCorrect)  return res.status(400).json({success : false , message : "Incorrect password"})
        
    user.password = newPassword
    await user.save()

    return res.status(200).json({
        success: true,
        message: "Password updated successfully"
    })

}catch(error){
    console.log("error in changing password" , error.message)
     return res.status(400).json({
        success: false,
        message: "error in changePassword"
    })
}
}

export {login , register , updateProfile , getUser , changePassword}