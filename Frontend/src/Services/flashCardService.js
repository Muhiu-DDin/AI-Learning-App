const getAllDocFlashcards = async ()=>{
    try{
        const res = await axiosInstance.get("flashcards/getFlashcards")
        if(res.data.success){
        return res.data.userFlashcards
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const getUserFlashcard = async (docId)=>{
    try{
        const res = await axiosInstance.get(`flashcards/${docId}`)
        if(res.data.success){
        return res.data.flashcards
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}


const reviewUserFlashcard = async (cardId)=>{
    try{
        const res = await axiosInstance.post(`flashcards/${cardId}/review`)
        if(res.data.success){
        return res.data.message
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}


const toggleUserFlashcard = async (cardId)=>{
    try{
        const res = await axiosInstance.put(`flashcards/${cardId}/star`)
        if(res.data.success){
        return res.data.message
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}


const deleteUserFlashcard = async (id)=>{
    try{
        const res = await axiosInstance.delete(`flashcards/${id}`)
        if(res.data.success){
        return res.data.message
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const flashcardServices = {deleteUserFlashcard , toggleUserFlashcard , reviewUserFlashcard , getAllDocFlashcards , getUserFlashcard}

export default flashcardServices