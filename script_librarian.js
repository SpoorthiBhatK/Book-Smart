// Function to display reservations for the librarian
function displayReservations() {
  let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  let table = document.getElementById("reservationList");
  table.innerHTML = '';  // Clear the existing table rows before adding new ones

  // Loop through reservations and display them in the table
  reservations.forEach((res, index) => {
    let row = table.insertRow();
    row.innerHTML = `<td>${index + 1}</td><td>${res.user}</td><td>${res.time}</td><td>${res.seatNumber}</td>`;
  });
}

// Run the displayReservations function when the librarian page loads
document.addEventListener("DOMContentLoaded", displayReservations);

// To update the reservations when a new seat is reserved
window.addEventListener('storage', function(event) {
  if (event.key === 'reservations') {
    displayReservations();
  }
});
