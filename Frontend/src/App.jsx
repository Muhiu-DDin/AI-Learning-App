import React from 'react'
import {Navigate, Route , Routes} from "react-router-dom"
import useUser from './context/authcontext'
import { Loader2 } from "lucide-react";
import LoginPage from "./pages/Auth/LoginPage"
import RegisterPage from "./pages/Auth/RegisterPage"
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from "./pages/Dashboard/DashboardPage"
import DocumentListPage from "./pages/Document/DocumentDetailPage"
import DocumentDetailPage from "./pages/Document/DocumentDetailPage"
import FlashCardList from "./pages/Flashcards/FlashCardList"
import FlashCardPage from "./pages/Flashcards/FlashCardPage"
import QuizResultPage from "./pages/Quizzes/QuizResultPage"
import QuizTakePage from "./pages/Quizzes/QuizTakePage"
import ProfilePage from "./pages/Profile/ProfilePage"

function App() {

  const {isCheckingAuth , authUser} = useUser()

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
}


  return (
    <Routes>
      <Route path="/" element={authUser ? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>} />
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<RegisterPage/>}/>
    
      {/* Protected Routes  */}
      {/* ANY URL that matches a child route will FIRST render ProtectedRoute , the particular route will be show in place of outlet*/}
      <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/document" element={<DocumentListPage/>}/>
        <Route path="/document/:id" element={<DocumentDetailPage/>}/>
        <Route path="/flashcards" element={<FlashCardList/>}/>
        <Route path="/document/:id/flashcards" element={<FlashCardPage/>}/>
        <Route path="/quizes/:quizId" element={<QuizTakePage/>}/>
        <Route path="/quizes/:quizId/result" element={<QuizResultPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Route>

      <Route path='*' element={<NotFoundPage/>}/>
    </Routes>
  )
}

export default App
