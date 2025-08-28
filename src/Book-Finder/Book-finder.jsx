import React, { useState, useEffect } from "react";
import "./Book-finder.css";

export default function BookFinder() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [warning, setWarning] = useState("");
  const booksPerPage = 12;

  const defaultTitle = "Politics";

  useEffect(() => {
    fetchBooks(defaultTitle, 1, true);
  }, []);

  const fetchBooks = async (query, page = 1, isInitial = false) => {
    if (!isInitial) setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${query}&page=${page}`
      );
      const data = await response.json();
      setBooks(data.docs);
      setTotalResults(data.numFound);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Something went wrong!");
    } finally {
      if (isInitial) setInitialLoading(false);
      setLoading(false);
    }
  };

  const searchBooks = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setWarning("⚠️ Please enter a book title before searching.");
      return;
    }
    setWarning("");
    setCurrentPage(1);
    fetchBooks(query);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(totalResults / booksPerPage);

  return (
    <div className="container">
      <h1 className="title">📚 Book Finder</h1>

      <form onSubmit={searchBooks} className="search-form">
        <input
          type="text"
          placeholder="Search by book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
        {loading && <div className="loader"></div>}
      </form>
      {warning && <p className="warning">{warning}</p>}
      {error && <p className="error">{error}</p>}

      {initialLoading ? (
        <p className="loading-msg">
          Books are loading, please wait a moment...
        </p>
      ) : (
        <>
          {currentBooks.length === 0 && !loading ? (
            <p className="status">No books found</p>
          ) : (
            <div className="grid">
              {currentBooks.map((book, idx) => {
                const coverId = book.cover_i;
                const coverUrl = coverId
                  ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover";

                const workKey = book.key;
                const detailsUrl = `https://openlibrary.org${workKey}`;

                return (
                  <div key={idx} className="card">
                    <a
                      href={detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={coverUrl} alt={book.title} className="cover" />
                    </a>
                    <h2 className="book-title">
                      <a
                        href={detailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {book.title}
                      </a>
                    </h2>
                    <p className="author">
                      {book.author_name?.[0] || "Unknown Author"}
                    </p>
                    <p className="year">{book.first_publish_year || "N/A"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {books.length > booksPerPage && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
