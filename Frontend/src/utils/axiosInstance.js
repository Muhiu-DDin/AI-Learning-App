import axios from 'axios'

const axiosInstance = axios.create({
    baseURL : "http://localhost:8000",
    // timeout is the maximum time in milisecond Axios will wait for a response from the server.
    timeout : 80000 , 
    headers : {
        "Content-Type" : "application/json",
        Accept :"application/json"
    }
})

axiosInstance.interceptors.request.use(
    // interceptors.request run before sending every request to server
    // config is the Axios request configuration object.It contains all details about the HTTP request that Axios is about to send.
    (config)=>{
        const accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            // like we do in axios.post
            //     headers: {
            //     Authorization: `Bearer ${token}`,
            //     "Content-Type": "application/json",
            //     },

            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    } ,
    // The error here comes from Axios itself before the request is even sent.like bug in out axios code , happen inside your request interceptor before Axios even sends the request.
    (error)=>{
        // pass the failed axios promise to the catch block of the api caller 
        return Promise.reject(error)
    }

)

axiosInstance.interceptors.response.use(
    // response is the object Axios gets from the server after the request succeeds
    (response) => response ,

    // happen after you call Axios but can include errors from multiple sources:
    (error)=>{
        if(error.response){
            if(error.response.status === 500){
                console.error('server error')
            }
        }else if(error.code === "ECONNABORTED"){
                console.error('request timeout')
        }

        return Promise.reject(error)
    }
)


export default axiosInstance
