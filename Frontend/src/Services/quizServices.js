const getAllDocQuizzes = async (docId)=>{
    try{
        const res = await axiosInstance.get(`quiz/getQuizzes/${docId}`)
        if(res.data.success){
        return res.data
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const getUserQuiz = async ()=>{
    try{
        
        const res = await axiosInstance.get(`quiz/getQuiz/${id}`)
        if(res.data.success){
        return res.data.quiz
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const submitUserQuiz = async (answers , id)=>{
    try{
        const res = await axiosInstance.post(`quiz/submitQuiz/${id}` , {answers})
        if(res.data.success){
        return res.data.quiz
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}


const getUserQuizResult = async (id)=>{
    try{
        const res = await axiosInstance.get(`quiz/getResult/${id}`)
        if(res.data.success){
        return res.data.data
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const deleteUserQuiz = async (id)=>{
    try{
        const res = await axiosInstance.delete(`quiz/delete/${id}`)
        if(res.data.success){
        return res.data.message
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const quizServices = {deleteUserQuiz , getAllDocQuizzes , getUserQuiz , getUserQuizResult , submitUserQuiz}

export default quizServices