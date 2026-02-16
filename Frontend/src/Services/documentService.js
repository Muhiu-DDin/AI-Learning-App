const uploadUserDoc = async (formData)=>{
    try{
        const res = await axiosInstance.post("documents/upload" , formData , {
            headers  : {
                'Content-Type' : 'multipart/form-data'
            }
        })
        if(res.data.success){
        return res.data.document
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}


const getAllUserDocs = async ()=>{
    try{
        const res = await axiosInstance.get("documents/getDocs")
        if(res.data.success){
        return res.data
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const getUserDoc = async (id)=>{
    try{
        const res = await axiosInstance.get(`documents/${id}`)
        if(res.data.success){
        return res.data.docData
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const deleteUserDoc = async (id)=>{
    try{
        const res = await axiosInstance.delete(`documents/${id}`)
        if(res.data.success){
        return res.data.message
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const documentServices = {deleteUserDoc , uploadUserDoc , getAllUserDocs , getUserDoc}

export default documentServices