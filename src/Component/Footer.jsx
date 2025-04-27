import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo / About */}
        <div className="space-y-4">
          <Link to="/" className="text-3xl font-bold text-white">
            BookBurst
          </Link>
          <p className="text-gray-400">
            Discover your next favorite book. Dive into the world of imagination and stories.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-white text-lg font-semibold mb-2">Quick Links</h3>
          <Link to="/discover" className="hover:text-yellow-400 transition">Discover</Link>
          <Link to="/bookshelf" className="hover:text-yellow-400 transition">My Bookshelf</Link>
          <Link to="/profile" className="hover:text-yellow-400 transition">Profile</Link>
          <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 text-2xl transition">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 text-2xl transition">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 text-2xl transition">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 text-2xl transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-gray-500 text-sm mt-10">
        © {new Date().getFullYear()} BookBurst. All rights reserved.
      </div>
    </footer>
  );
}
