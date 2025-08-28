import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import BookFinder from './Book-Finder/Book-finder.jsx'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BookFinder />
  </React.StrictMode>
);