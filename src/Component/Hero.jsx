import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6">
      <div className="max-w-4xl text-center text-white space-y-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Dive into a World of <span className="text-yellow-300">Stories</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-2xl text-white/90"
        >
          Discover, Read, and Save your favorite books. Explore endless adventures.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link
            to="/discover"
            className="inline-block mt-6 px-8 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-full text-lg hover:bg-yellow-300 transition-transform hover:scale-105"
          >
            Start Reading
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
