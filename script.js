const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = []; // Stores the full, unfiltered list of movies


// ===========================
// 1. RENDER MOVIES
// ===========================
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');

        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button onclick="editMoviePrompt(${movie.id}, '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
            <button onclick="deleteMovie(${movie.id})">Delete</button>
        `;

        movieListDiv.appendChild(movieElement);
    });
}


// ===========================
// 2. FETCH MOVIES (READ)
// ===========================
function fetchMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies;       // store full list
            renderMovies(allMovies);  // display full list
        })
        .catch(error => console.error('Error fetching movies:', error));
}

fetchMovies(); // Initial load



// ===========================
// 3. SEARCH FILTER
// ===========================
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredMovies = allMovies.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        const genreMatch = movie.genre.toLowerCase().includes(searchTerm);
        return titleMatch || genreMatch;
    });

    renderMovies(filteredMovies);
});



// ===========================
// 4. CREATE MOVIE (POST)
// ===========================
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add movie');
        return response.json();
    })
    .then(() => {
        form.reset();
        fetchMovies(); // Refresh list
    })
    .catch(error => console.error('Error adding movie:', error));
});



// ===========================
// 5. EDIT MOVIE PROMPT
// ===========================
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    const newYearStr = prompt('Enter new Year:', currentYear);
    const newGenre = prompt('Enter new Genre:', currentGenre);

    if (newTitle && newYearStr && newGenre) {
        const updatedMovie = {
            id: id,
            title: newTitle,
            year: parseInt(newYearStr),
            genre: newGenre
        };

        updateMovie(id, updatedMovie);
    }
}



// ===========================
// 6. UPDATE MOVIE (PUT)
// ===========================
function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update movie');
        return response.json();
    })
    .then(() => {
        fetchMovies(); // Refresh list
    })
    .catch(error => console.error('Error updating movie:', error));
}



// ===========================
// 7. DELETE MOVIE (DELETE)
// ===========================
function deleteMovie(movieId) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete movie');
        fetchMovies(); // Refresh list
    })
    .catch(error => console.error('Error deleting movie:', error));
}
