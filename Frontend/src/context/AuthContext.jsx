import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance"

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth , setIsCheckingAuth] = useState(true)
  const [isAuthenticated , setIsAuthenticated] = useState(false)

  // getAuth() uses for verifying token from backend , while localStorage → to persist token after refresh 


  const checkAuthStatus = async()=>{
    try{
        setIsCheckingAuth(true)
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
 
        if(token && user){
          setIsAuthenticated(true)
          const userObj = JSON.parse(user)
          setAuthUser(userObj)
        }

    }catch(error){
        console.log("error in checkAuthStatus", error.response?.data?.message)
        setAuthUser(null)
    }finally{
        setIsCheckingAuth(false)
    }
  }

  const loginContext = (userData , token)=>{
      localStorage.setItem('token' , token)
      localStorage.setItem('user' , JSON.stringify(userData))
      setAuthUser(userData)
      setIsAuthenticated(true)
  }

  const logout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthUser(null)
    setIsAuthenticated(false)
    window.location.href = "/"
  }

  const updateProfileContext = (updatedUserData)=>{
      localStorage.setItem('user' , JSON.stringify(updatedUserData))
      setAuthUser(updatedUserData)
  }


 

  const value = { authUser , isCheckingAuth  , isAuthenticated  , checkAuthStatus , loginContext , logout , updateProfileContext};


  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// hook
const useUser = () => useContext(UserContext);

export default useUser;
