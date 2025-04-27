import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- NEW
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // <-- ADD THIS
import { db } from "../firebase/db"; // <-- Your initialized Firestore instance
import { auth } from "../firebase/auth"; // You already have this
import Hero from "./Hero";


export default function Book() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(() => {
    const terms = ["flowers", "magic", "science", "adventure", "love"];
    return terms[Math.floor(Math.random() * terms.length)];
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- NEW
  
  const booksPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const API_KEY = "AIzaSyDJEj7zoviIU7AWuSDn4hjeQemA7tm-KrQ";
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=35&key=${API_KEY}`);
        const data = await res.json();
        const mappedBooks = data.items?.map(item => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors?.join(", ") || "Unknown",
          imageUrl: item.volumeInfo.imageLinks?.thumbnail || "",
          description: item.volumeInfo.description || "",
          infoLink: item.volumeInfo.infoLink,
          previewLink: item.accessInfo?.webReaderLink, // <-- Use this instead
          averageRating: item.volumeInfo.averageRating || 0, // <-- NEW
          ratingsCount: item.volumeInfo.ratingsCount || 0,  // <-- NEW
        })) || [];
        setBooks(mappedBooks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      setSearchTerm(query.trim());
    }
  };

  const openBook = async (book) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Create a document under user's bookshelf
        const bookRef = doc(db, "users", user.uid, "bookshelf", book.id);
  
        await setDoc(bookRef, {
          title: book.title,
          authors: book.authors,
          previewLink: book.previewLink,
          bookmark: "Start",
          rating: 0,
          timestamp: serverTimestamp(),
        });
  
        // 🔥 After saving the book, navigate to the user's bookshelf
        navigate(`/users/${user.uid}/bookshelf`);
      } catch (error) {
        console.error("Error saving book:", error);
      }
    } else {
      navigate("/login");
    }
  };
  
  
  const indexOfLastBook = currentPage * booksPerPage;
  const currentBooks = books.slice(indexOfLastBook - booksPerPage, indexOfLastBook);
  const totalPages = Math.min(5, Math.ceil(books.length / booksPerPage));
    // Pagination logic
    
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    };
  
    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    };
  

  return (<>
    <Hero/>
    <div className="min-h-screen bg-gray-100 py-8 px-4">
     <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 flex">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search for books..."
    className="w-full p-2 rounded-l-md border border-gray-300 focus:outline-none"
  />
  <button
    type="submit"
    className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
  >
    Search
  </button>
</form>


      {/* Books */}
      {!loading && currentBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <img src={book.imageUrl} alt={book.title} className="h-64 object-cover w-full"/>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-semibold text-lg mb-1">{book.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{book.authors}</p>

            
           

                <button
                  onClick={() => openBook(book)}
                  className="mt-auto bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                  Read Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
       {!loading && currentBooks.length === 0 && (
        <div className="text-center text-gray-500 text-lg">No books found.</div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-12 items-center space-x-4">
      <button
    onClick={handlePreviousPage}
    disabled={currentPage === 1}
    className="px-4 py-2 rounded-md bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-500 hover:text-white transition disabled:opacity-50"
  >
    Previous
  </button>

  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(index + 1)}
      className={`px-4 py-2 rounded-md text-lg font-medium ${
        currentPage === index + 1
          ? "bg-indigo-600 text-white"
          : "bg-white text-indigo-600 border border-indigo-600"
      } hover:bg-indigo-500 hover:text-white transition`}
    >
      {index + 1}
    </button>
  ))}

  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className="px-4 py-2 rounded-md bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-500 hover:text-white transition disabled:opacity-50"
  >
    Next
  </button>
</div>

      {/* Pagination Buttons same */}
    </div>
    </>
  );
}
