import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { auth } from "../firebase/auth"; // ✅ Import firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // ✅ Import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get first letter from email
        setUserInitial(user.email.charAt(0).toUpperCase());
      } else {
        setUserInitial(null);
      }
    });

    return () => unsubscribe(); // Clean up
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // After logout go to login
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BookBurst
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/bookshelf" className="text-gray-700 hover:text-blue-600 font-medium">
              My Bookshelf
            </Link>
            <Link to="/discover" className="text-gray-700 hover:text-blue-600 font-medium">
              Discover
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
              Profile
            </Link>

            {userInitial ? (
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">
                  {userInitial}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-2">
            <Link to="/bookshelf" className="block text-gray-700 hover:text-blue-600 font-medium">
              My Bookshelf
            </Link>
            <Link to="/discover" className="block text-gray-700 hover:text-blue-600 font-medium">
              Discover
            </Link>
            <Link to="/profile" className="block text-gray-700 hover:text-blue-600 font-medium">
              Profile
            </Link>

            {userInitial ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition mt-2"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition mt-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
