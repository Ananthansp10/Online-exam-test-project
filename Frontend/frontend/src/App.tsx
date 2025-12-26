import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignupPage from "./components/SignupPage"
import SigninPage from "./components/SigninPage"
import UserDashboard from "./components/UserDashboard"
import AdminSigninPage from "./components/admin/AdminSigninPage"
import AdminDashboard from "./components/admin/AdminDashboard"
import CreateExam from "./components/admin/CreateExam"
import AddQuestions from "./components/admin/AddQuestions"
import QuestionsPage from "./components/QuestionsPage"
import ProtectedRoute from "./components/protectedRoute"
import UnAuthorized from "./components/UnAuthorized"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/signin" element={<SigninPage/>}/>
        <Route element={<ProtectedRoute allowedRoles={["user"]}/>}>
            <Route path="/user/dashboard" element={<UserDashboard/>}/>
        </Route>
        <Route path="/unauthorized" element={<UnAuthorized/>}/>
        <Route path="/admin/signin" element={<AdminSigninPage/>}/>
        <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/create-exam" element={<CreateExam/>}/>
          <Route path="/admin/add-questions/:examId" element={<AddQuestions/>}/>
        </Route>
        <Route path="/exam/questions/:examId" element={<QuestionsPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
