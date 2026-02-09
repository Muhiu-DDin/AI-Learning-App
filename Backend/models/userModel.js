import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username : {
        type : String , 
        unique : true , 
        required : [true , "Username is required"],
        trim : true ,
        minlength : [3 , "Username must be atleast 3 characters"]
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        unique : true , 
        lowercase : true , 
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "Provide a valid email"]
    } , 
    password : {
        type : String , 
        required : [true , "Password is required"],
        select : false , 
        minlength : [6 , "Password must be alteast 6 characters"]
    } , 
    profileImage : {
        type : String , 
        default : ""
    }
} , {timestamps : true})


userSchema.pre("save" , async function (){
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password , 10 )
        }
})
userSchema.methods.isPasswordCorrect = async function(enterPass){
    const result = await bcrypt.compare(enterPass , this.password)
    return result
}   

const userModel = mongoose.models?.userModel || mongoose.model("userModel" , userSchema)
export default userModel