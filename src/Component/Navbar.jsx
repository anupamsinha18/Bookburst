import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { auth } from "../firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInitial, setUserInitial] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserInitial(user.email.charAt(0).toUpperCase());
            } else {
                setUserInitial(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            closeMenu(); // Close menu after logout
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleBookshelfClick = (e) => {
        if (!userInitial) {
            e.preventDefault();
            alert("Please login to access your Bookshelf!");
            navigate("/login");
        }
        closeMenu(); // Close menu after bookshelf click
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-blue-600" onClick={closeMenu}>
                        BookBurst
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/bookshelf" onClick={handleBookshelfClick} className="text-gray-700 hover:text-blue-600 font-medium">
                            My Bookshelf
                        </Link>
                        <Link to="/discover" onClick={closeMenu} className="text-gray-700 hover:text-blue-600 font-medium">
                            Discover
                        </Link>
                        <Link to="/profile" onClick={closeMenu} className="text-gray-700 hover:text-blue-600 font-medium">
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
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="px-2 pt-2 pb-3 space-y-2">
                        <Link to="/bookshelf" onClick={handleBookshelfClick} className="block text-gray-700 hover:text-blue-600 font-medium">
                            My Bookshelf
                        </Link>
                        <Link to="/discover" onClick={closeMenu} className="block text-gray-700 hover:text-blue-600 font-medium">
                            Discover
                        </Link>
                        <Link to="/profile" onClick={closeMenu} className="block text-gray-700 hover:text-blue-600 font-medium">
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
                                onClick={closeMenu}
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
