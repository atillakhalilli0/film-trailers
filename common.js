// Configuration
const API_KEY = 'd8972914c7508d0355cce580a7e5910d';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780';

// DOM Elements
const navbarToggle = document.getElementById('navbar-toggle');
const navbarMenu = document.getElementById('navbar-menu');
const loadingElement = document.getElementById('loading');
const moviesContainer = document.getElementById('movies-container');

// Toggle navigation menu on mobile
navbarToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('hidden');
});

// Get current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Hide loading indicator
function hideLoading() {
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

// Show error message
function showError(message) {
    if (moviesContainer) {
        moviesContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                <p class="text-xl">${message}</p>
            </div>
        `;
    }
}

// Initialize page routing
function initializePageRouting() {
    if (currentPage === 'index.html') {
        if (typeof fetchPopularMovies === 'function') {
            fetchPopularMovies();
        }
    } else if (currentPage === 'genres.html') {
        if (typeof fetchGenres === 'function') {
            fetchGenres();
        }
    } else if (currentPage === 'genre_movies.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const genreId = urlParams.get('id');
        if (genreId && typeof fetchMoviesByGenre === 'function') {
            fetchMoviesByGenre(genreId);
        }
    }
}

// Export for modules
export {
    API_KEY,
    API_BASE_URL,
    IMAGE_BASE_URL,
    hideLoading,
    showError,
    initializePageRouting
};