import { initializePageRouting } from './common.js';
import { initializeFeaturedTrailers } from './featuredTrailers.js';
import { fetchPopularMovies } from './trending.js';
import { initializeCategories } from './categories.js';

// Make functions available globally for page routing
window.fetchPopularMovies = fetchPopularMovies;
// window.fetchGenres = fetchGenres;
// window.fetchMoviesByGenre = fetchMoviesByGenre;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize featured trailers carousel if elements exist
    if (document.getElementById('carousel')) {
        initializeFeaturedTrailers();
    }
    
    // Handle page routing
    initializePageRouting();
});

// main.js or app.js - Import and initialize the categories module


// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    // Initialize categories section
    initializeCategories();
    
    // Other initializations...
});