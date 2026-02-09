import { createContext, useContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const {isCheckingAuth , setIsCheckingAuth} = useState(true)

  const value = { authUser , setAuthUser , isCheckingAuth , setIsCheckingAuth };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// hook
const useUser = () => useContext(UserContext);

export default useUser;
