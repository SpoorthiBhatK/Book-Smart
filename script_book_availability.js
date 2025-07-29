import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCTp_NJuLG6kvDha3mplOeU8hUJ3ft9mGA",
  authDomain: "book-smart-c3035.firebaseapp.com",
  databaseURL: "https://book-smart-c3035-default-rtdb.firebaseio.com",
  projectId: "book-smart-c3035",
  storageBucket: "book-smart-c3035.appspot.com",
  messagingSenderId: "513786778563",
  appId: "1:513786778563:web:707945c3d426a5c0b9a376",
  measurementId: "G-4P1F00JL5L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const tableBody = document.getElementById("book-table-body");
const searchInput = document.getElementById("search-input");

let groupedBooks = {};

// Fetching and updating book data from Firebase
onValue(ref(db, 'Books/'), (snapshot) => {
  const data = snapshot.val();
  groupedBooks = {}; // Reset grouped books

  if (data) {
    for (const id in data) {
      const book = data[id];
      const key = `${book.Title}___${book.Author}`; // Create a unique key for each book group

      // Initialize groupedBooks if it's the first time encountering this book combination
      if (!groupedBooks[key]) {
        groupedBooks[key] = {
          title: book.Title,
          author: book.Author,
          total: 0,
          available: 0
        };
      }

      // Count the total number of books and available books
      groupedBooks[key].total += 1;
      if (book.Status === "Available") {
        groupedBooks[key].available += 1;
      }
    }
  } else {
    console.log("No books data found in Firebase.");
  }

  // Re-render the table with the latest data
  renderTable(searchInput.value);
});

// Filter the books based on search input and update the table
const renderTable = (filter = "") => {
  const filterLower = filter.toLowerCase();
  tableBody.innerHTML = '';  // Clear existing table data

  for (const key in groupedBooks) {
    const group = groupedBooks[key];
    if (group.title.toLowerCase().includes(filterLower)) {
      const row = `
        <tr>
          <td>${group.title}</td>
          <td>${group.author}</td>
          <td>${group.available}</td>
          <td>${group.total}</td>
        </tr>
      `;
      tableBody.innerHTML += row; // Add each row of books dynamically
    }
  }
};

// Search input event listener for filtering books
searchInput.addEventListener("input", () => {
  renderTable(searchInput.value);
});
