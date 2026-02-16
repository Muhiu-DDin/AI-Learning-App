import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance"

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth , setIsCheckingAuth] = useState(true)

  const getAuth =async  () =>{
    try{
      setIsCheckingAuth(true)
      const res = await axiosInstance.get("auth/profile")
      if(res.data.success) setAuthUser(res.data.user)
      return true
    }catch(error){
        console.log("error in getting auth", error.response?.data?.message)
        setAuthUser(null)
    }finally{
      setIsCheckingAuth(false)
    }
  }

 

  const value = { authUser , setAuthUser , isCheckingAuth , setIsCheckingAuth , getAuth};


  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// hook
const useUser = () => useContext(UserContext);

export default useUser;
