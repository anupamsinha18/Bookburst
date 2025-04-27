import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Navbar from "../Component/Navbar.jsx"
import LoginPage from "../Auth/Login.jsx"
import SignupPage from "../Auth/SIgnup.jsx"
import BookList from "../Component/Book.jsx"

const MainLayout = () => {
  return (
    <>
   <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<BookList/>}/>

      </Routes>
    </Router>
    </>
  )
}

export default MainLayout
