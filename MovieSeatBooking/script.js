const container = document.querySelector(".container"),
  available_seats_NodeList = document.querySelectorAll(".row .seat:not(.occupied)"),
  purchased_seats = document.querySelector("#count"),
  total_expense = document.querySelector("#total"),
  selected_movie = document.querySelector("#movie");

// render() must be the 1st function call, so when the page 1st loads/reloads,
// the UI can be updated with the latest data stored in local storage
renderUIWithLocalStorageData();

let ticket_price;

function updatePurchasedSeatsUI() {
  const selected_seats_NodeList = document.querySelectorAll(".row .seat.selected");

  ticket_price = parseInt(selected_movie.value);

  purchased_seats.innerText = selected_seats_NodeList.length;

  total_expense.innerText = selected_seats_NodeList.length * ticket_price;

  // To apply local storage: 1st, selected_seats_NodeList is turned to an array using the spread operator.
  // Then, use map() on it to get a new array (selected_seats_array), which contains the indices of the selected seats.
  // The indices are extracted from available_seats_NodeList, which's turned to an array, also by spread operator
  // then pass selected_seats_array to JSON.stringify() to save it to local storage as 'selected_seats'
  selected_seats_array = [...selected_seats_NodeList].map(seat => {
    const available_seats_array = [...available_seats_NodeList],
      selected_seat_index = available_seats_array.indexOf(seat);

    return selected_seat_index;
  });

  console.log(selected_seats_array);

  const selected_seats_json = JSON.stringify(selected_seats_array);

  localStorage.setItem("selected_seats", selected_seats_json);
}

function saveSelectedMovieToLocalStorage(selectedMovieIndex, moviePrice) {
  localStorage.setItem("selected_movie", selectedMovieIndex);

  localStorage.setItem("selected_movie_price", moviePrice);
}

function renderUIWithLocalStorageData() {
  // SEATS: available_seats_NodeList & localStorage_selectedSeats
  const localStorage_selectedSeats = JSON.parse(localStorage.getItem("selected_seats"));

  console.log(localStorage_selectedSeats);

  // 1st check if 'selected_seats' exists in local storage & if it does, make sure it's not an empty array
  // 2nd, loop thru available_seats_NodeList & use its indices to determine if a certain value exists in 'selected_seats'
  // if it does, indexOf() called on localStorage_selectedSeats returns a value that's greater than -1
  // & then a class called 'selected' is added to a seat in available_seats_NodeList, renders it blue
  if (localStorage_selectedSeats !== null && localStorage_selectedSeats.length > 0) {
    available_seats_NodeList.forEach((seat, index) => {
      if (localStorage_selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  // MOVIES
  const localStorage_selectedMovie = localStorage.getItem("selected_movie");

  if (localStorage_selectedMovie !== null) {
    selected_movie.selectedIndex = localStorage_selectedMovie;
  }
}

// EVENT HANDLERS
// seats click events
container.addEventListener("click", e => {
  if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
    // selecting an available seat toggles its class from 'seat' to 'seat selected', thus renders it blue
    // deselecting it toggles its class back to just 'seat', thus renders it black again
    e.target.classList.toggle("selected");

    updatePurchasedSeatsUI();
  }
});

// movies change events
selected_movie.addEventListener("change", e => {
  ticket_price = parseInt(e.target.value);

  const selected_movie_index = e.target.selectedIndex;

  saveSelectedMovieToLocalStorage(selected_movie_index, ticket_price);

  updatePurchasedSeatsUI();
});

// updatePurchasedSeats() must be called after the event handlers,
// so the total number of purchased seats & expenses can be updated on the UI accordingly
updatePurchasedSeatsUI();
