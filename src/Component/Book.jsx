import { useEffect, useState } from "react";

export default function Book() {
  const [books, setBooks] = useState([]);
  const randomDefaultTerms = [
    "flowers", "magic", "science", "adventure", "love",
    "mystery", "history", "technology", "art", "philosophy",
  ];
  
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(() => {
    const randomIndex = Math.floor(Math.random() * randomDefaultTerms.length);
    return randomDefaultTerms[randomIndex];
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const booksPerPage = 8; // 8 books per page

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const API_KEY = "AIzaSyDJEj7zoviIU7AWuSDn4hjeQemA7tm-KrQ";
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=35&key=${API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();

        const mappedBooks = data.items?.map(item => ({
          id: item.id,
          title: item.volumeInfo.title || "Untitled",
          authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
          imageUrl: item.volumeInfo.imageLinks?.thumbnail || getPlaceholder(item.volumeInfo.title),
          description: item.volumeInfo.description || "",
          infoLink: item.volumeInfo.infoLink || "#",
          previewLink: item.volumeInfo.previewLink || null, // 📚 New field
        })) || [];

        setBooks(mappedBooks);
        setCurrentPage(1); // reset page after new search
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm]);

  const getPlaceholder = (title) => {
    const initials = title
      .split(" ")
      .map(word => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    
    return `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="220" viewBox="0 0 150 220">
         <rect width="100%" height="100%" fill="#E5E7EB"/>
         <text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#9CA3AF" font-size="40" font-family="Arial">${initials}</text>
       </svg>`
    )}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      setSearchTerm(query.trim());
    }
  };

  const openReader = (book) => {
    setSelectedBook(book);
    localStorage.setItem('lastReadingBook', JSON.stringify(book));
  };

  const closeReader = () => {
    setSelectedBook(null);
  };

  useEffect(() => {
    const savedBook = localStorage.getItem('lastReadingBook');
    if (savedBook) {
      setSelectedBook(JSON.parse(savedBook));
    }
  }, []);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.min(5, Math.ceil(books.length / booksPerPage)); // max 5 pages

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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">Explore Books</h1>

      {/* Search Area */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
          <input
            type="text"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-600 text-lg">Loading books...</div>
      )}

      {/* Books Grid */}
      {!loading && currentBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition transform duration-300 flex flex-col"
            >
              <div className="h-64 w-full overflow-hidden flex items-center justify-center bg-gray-200">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="object-contain h-full w-full"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800">{book.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{book.authors}</p>
                
                {/* View Details */}
                <a
                  href={book.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition text-center"
                >
                  View Details
                </a>

                {/* Read Book */}
                {book.previewLink && (
                  <button
                    onClick={() => openReader(book)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-center"
                  >
                    Read Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && currentBooks.length === 0 && (
        <div className="text-center text-gray-500 text-lg">No books found.</div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
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
      )}

      {/* Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedBook.title}</h2>
              <button onClick={closeReader} className="text-red-500 font-bold text-lg">X</button>
            </div>
            <iframe
              src={selectedBook.previewLink}
              title="Book Preview"
              className="flex-1 w-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
