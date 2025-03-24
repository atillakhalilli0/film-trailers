import { API_KEY, API_BASE_URL, IMAGE_BASE_URL, hideLoading, showError } from './common.js';

// DOM Elements
const moviesContainer = document.getElementById('movies-container');

// Store genres list globally
let genreList = [];

// Fetch genre list
async function fetchGenres() {
    try {
        const response = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        genreList = data.genres; // Store genres
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Fetch popular movies for homepage
async function fetchPopularMovies() {
    try {
        await fetchGenres(); // Ensure genres are loaded before fetching movies
        const response = await fetch(`${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            renderMovies(data.results);
        } else {
            showError('No movies found');
        }
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        showError('Failed to load movies');
    } finally {
        hideLoading();
    }
}

// Render movies list
function renderMovies(movies) {
    if (!moviesContainer) return;

    moviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105';

        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/780x400?text=No+Image+Available';

        const overview = movie.overview
            ? (movie.overview.length > 100 ? movie.overview.substring(0, 100) + '...' : movie.overview)
            : 'No description available';

        // Generate a random rating for demo purposes (would use actual rating in production)
        const rating = (Math.random() * 2 + 7).toFixed(1);

        // Get genres by ids
        const movieGenres = getGenresByIds(movie.genre_ids);

        movieCard.innerHTML = `
            <div class="relative">
                <img class="w-full h-96 object-contain" src="${posterPath}" alt="${movie.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                ${movie.release_date && new Date(movie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 
                    '<div class="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</div>' : ''}
                <a href="film_page.html?id=${movie.id}" class="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <i class="fas fa-play"></i>
                </a>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-white">${movie.title}</h3>
                    <span class="text-yellow-500 flex items-center text-sm">
                        <i class="fas fa-star mr-1"></i>${rating}
                    </span>
                </div>
                <p class="text-gray-400 text-sm mt-1">${movieGenres}</p>
                <p class="text-gray-300 text-sm mt-2 line-clamp-2">${overview}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-gray-400 text-xs">${movie.release_date || 'Unknown'}</span>
                    <div class="flex space-x-2">
                        <button onclick="addToWatchlist(movie.id, movie.title, movie.poster_path, movie.vote_average, movie.overview, movie.release_date)" class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full">
                            + Watchlist
                        </button>
                        <a href="film_page.html?id=${movie.id}" class="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full flex items-center">
                            <i class="fas fa-play-circle mr-1"></i> Trailer
                        </a>
                    </div>
                </div>
            </div>
        `;

        function addFav(id) {
            const favList = JSON.parse(localStorage.getItem('favList')) || []
          
            const isElementExists = favList.some(item => item.id == id)
          
            if (!isElementExists) {
                const favElement = movie.find(item => item.id == id)
                favList.push(favElement)
                localStorage.setItem('favList', JSON.stringify(favList))
            } else alert('this element is already exist in FavList')
          }

        moviesContainer.appendChild(movieCard);
    });
}

// Get genres by movie genre ids
function getGenresByIds(genreIds) {
    if (!genreIds || genreIds.length === 0) return 'Unknown Genre';

    const genreNames = genreIds
        .map(id => {
            const genre = genreList.find(g => g.id === id);
            return genre ? genre.name : null;
        })
        .filter(Boolean); // Remove null values

    return genreNames.length > 0 ? genreNames.join(', ') : 'Unknown Genre';
}

// Export functions
export { fetchPopularMovies };
