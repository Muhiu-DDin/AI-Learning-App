import useUser from '../../context/authcontext'
import AppLayout from "../layout/AppLayout"
import { Navigate, Outlet } from 'react-router-dom';


function ProtectedRoute() {
    const {authUser , isCheckingAuth} = useUser()

    
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
     );
    }

  return authUser ? (
    <AppLayout>
        <Outlet/>
    </AppLayout>
  ) : 
  (
    <Navigate to="/login" replace/>
  )
}

export default ProtectedRoute
