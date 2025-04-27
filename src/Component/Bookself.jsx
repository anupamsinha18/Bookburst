import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Added setDoc to update Firestore
import { db } from "../firebase/db";
import { auth } from "../firebase/auth";

export default function Bookshelf() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [bookmark, setBookmark] = useState("Start");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      const user = auth.currentUser;
      if (!user) return; // No user logged in

      try {
        const bookRef = doc(db, "users", user.uid, "bookshelf", id);
        const bookSnap = await getDoc(bookRef);

        if (bookSnap.exists()) {
          const bookData = bookSnap.data();
          setBook(bookData);

          setRating(localStorage.getItem(`rating-${id}`) || bookData.rating || 0);
          setBookmark(localStorage.getItem(`bookmark-${id}`) || bookData.bookmark || "Start");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const saveBookmark = () => {
    const position = prompt("Enter your bookmark (e.g., Page 45)");
    if (position) {
      setBookmark(position);
      localStorage.setItem(`bookmark-${id}`, position);

      // Update Firestore as well
      const user = auth.currentUser;
      if (user) {
        const bookRef = doc(db, "users", user.uid, "bookshelf", id);
        setDoc(bookRef, { bookmark: position }, { merge: true }); // merge ensures we only update bookmark
      }
    }
  };

  const saveRating = (star) => {
    setRating(star);
    localStorage.setItem(`rating-${id}`, star);

    // Update Firestore as well
    const user = auth.currentUser;
    if (user) {
      const bookRef = doc(db, "users", user.uid, "bookshelf", id);
      setDoc(bookRef, { rating: star }, { merge: true }); // merge ensures we only update rating
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!book) {
    return <div className="text-center py-20">No Book Selected</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{book.title}</h1>

      <div className="flex justify-center mb-4 space-x-4">
        <button onClick={saveBookmark} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Bookmark</button>

        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => saveRating(star)}
              className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-lg">Current Bookmark: <strong>{bookmark}</strong></p>
      </div>

      <div className="w-full h-[75vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <iframe
          src={book.previewLink}
          title="Book Reader"
          className="w-full h-full"
          frameBorder="0"
        />
      </div>
    </div>
  );
}
