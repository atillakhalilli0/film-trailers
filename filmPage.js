// filmPage.js - Main controller for film page
function initFilmPage() {
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        showError('No movie ID specified');
        hideLoading();
        return;
    }
    
    // Fetch movie details
    fetchMovieDetails(movieId)
        .then(movie => {
            renderMovieDetails(movie);
            return fetchRelatedMovies(movieId);
        })
        .then(data => {
            renderRelatedMovies(data.results);
        })
        .catch(error => {
            console.error('Error loading movie data:', error);
            showError('Failed to load movie details: ' + error.message);
        })
        .finally(() => {
            hideLoading();
        });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'film_page.html') {
        initFilmPage();
    }
});