import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Navbar from "../Component/Navbar.jsx"
import LoginPage from "../Auth/Login.jsx"
import SignupPage from "../Auth/SIgnup.jsx"
import BookList from "../Component/Book.jsx"
import Hero from "../Component/Hero.jsx"
import Footer from "../Component/Footer.jsx"
import Bookshelf from "../Component/Bookself.jsx"

const MainLayout = () => {
  return (
    <>
   <Router>
      <Navbar />
     
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<BookList/>}/>
        <Route path="/users/:userId/bookshelf" element={<Bookshelf />} />
        </Routes>
      <Footer/>
    </Router>
    </>
  )
}

export default MainLayout
