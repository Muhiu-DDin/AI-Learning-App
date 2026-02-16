import axiosInstance from "../utils/axiosInstance"

const loginUser  = async (email , password)=>{
    try{
       const res = await axiosInstance.post("auth/login" , {email , password})
       if(res.data.success){
        return res.data.userData
       }
    }catch(error){
         throw new Error(error.response.data.message);
    }
}


const registerUser  = async (email , password , username)=>{
     try{
       const res = await axiosInstance.post("auth/register" , {email , password , username})
       if(res.data.success){
        return res.data
       }
    }catch(error){
         throw new Error(error.response.data.message);
    }
}


const updateUserProfile = async (username , profileImage)=>{
    try{
        const res = await axiosInstance.post("auth/updateprofile" , {username , profileImage})
        if(res.data.success){
        return res.data
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}


const updateUserPassword  = async (currentPassword , newPassword)=>{
    try{
        const res = await axiosInstance.post("auth/changepassword" , {currentPassword , newPassword})
        if(res.data.success){
        return res.data.message
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const authServices =  {updateUserPassword , updateUserProfile , registerUser , loginUser}

export default authServices