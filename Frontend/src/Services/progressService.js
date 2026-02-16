const getUserDashboard = async ()=>{
    try{
        const res = await axiosInstance.get("getProgress/getDashboard")
        if(res.data.success){
        return res.data
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

export default getUserDashboard