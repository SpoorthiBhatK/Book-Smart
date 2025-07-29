const leftContainer = document.getElementById('left-seats');
const rightContainer = document.getElementById('right-seats');

let selectedSeats = [];
let seatCounter = 101;  // Start from H101
const seatStatus = JSON.parse(localStorage.getItem('seatStatus')) || {};

// Generate seat divs for H101 to H131
function createSeat(seatId) {
  const seat = document.createElement('div');
  seat.classList.add('seat');
  seat.dataset.seatId = seatId;
  seat.innerText = seatId;

  if (seatStatus[seatId] === 'reserved') {
    seat.classList.add('occupied');
  }

  seat.addEventListener('click', () => {
    if (seat.classList.contains('occupied')) return;

    if (seat.classList.contains('selected')) {
      seat.classList.remove('selected');
      selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
      seat.classList.add('selected');
      selectedSeats.push(seatId);
    }
  });

  return seat;
}

// Create left & right seats with seat IDs H101 to H131
for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 3; col++) {
    leftContainer.appendChild(createSeat(`H${seatCounter++}`));
  }
}
for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 3; col++) {
    rightContainer.appendChild(createSeat(`H${seatCounter++}`));
  }
}

// Update seat status in Firebase and localStorage
document.getElementById('reserveButton').addEventListener('click', () => {
  const username = localStorage.getItem('booksmartUser');
  if (!username) {
    alert("Please login first!");
    return;
  }

  const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

  selectedSeats.forEach(seatId => {
    seatStatus[seatId] = 'reserved';
    const seatDiv = document.querySelector(`.seat[data-seat-id='${seatId}']`);
    if (seatDiv) {
      seatDiv.classList.remove('selected');
      seatDiv.classList.add('occupied');
    }

    // Update seat in Firebase (Make sure you have a valid Firebase reference for your seats)
    update(ref(database, `seats/${seatId}`), {
      status: 'reserved',
      seatID: seatId,
      lastUpdated: new Date().toLocaleTimeString()
    });

    // Save reservation locally
    reservations.push({
      user: username,
      seatNumber: seatId,
      time: new Date().toLocaleString()
    });
  });

  localStorage.setItem('seatStatus', JSON.stringify(seatStatus));
  localStorage.setItem('reservations', JSON.stringify(reservations));
  selectedSeats = [];
});

// Firebase Realtime Database listener to automatically update seat status in the UI
const seatStatusRef = ref(database, 'seats/');

onValue(seatStatusRef, (snapshot) => {
  const seats = snapshot.val();
  for (let seatNumber in seats) {
    const seat = seats[seatNumber];
    updateSeatDisplay(seatNumber, seat.status);
  }
});

// Update seat display based on Firebase data
function updateSeatDisplay(seatNumber, status) {
  const seatDiv = document.querySelector(`.seat[data-seat-id='${seatNumber}']`);
  if (!seatDiv) return;

  if (status === 'reserved') {
    seatDiv.classList.add('occupied');
    seatDiv.classList.remove('selected');
  } else if (status === 'vacant') {
    seatDiv.classList.remove('occupied');
    seatDiv.classList.remove('selected');
  }
}

// Logout function
function logout() {
  localStorage.removeItem('booksmartUser');
  localStorage.removeItem('booksmartPass');
  window.location.href = 'login.html';
}
