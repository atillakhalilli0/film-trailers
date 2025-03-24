import { API_KEY, API_BASE_URL, IMAGE_BASE_URL } from './common.js';

// DOM Elements
const searchInput = document.querySelector('input[placeholder="Search for films..."]');
const moviesContainer = document.getElementById('movies-container');

// Store results for use with watchlist
let searchResults = [];

// Helper functions that might not be in common.js
function showLoading() {
    // Create or show loading indicator if not found in common.js
    const loadingEl = document.getElementById('loading-indicator') || createLoadingIndicator();
    loadingEl.style.display = 'flex';
}

function hideLoading() {
    // Hide loading indicator if it exists
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }
}

function showError(message) {
    // Show error message
    alert(message || 'An error occurred');
    console.error(message);
}

// Create loading indicator if it doesn't exist
function createLoadingIndicator() {
    const loadingEl = document.createElement('div');
    loadingEl.id = 'loading-indicator';
    loadingEl.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    loadingEl.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            <p class="text-white">Loading...</p>
        </div>
    `;
    document.body.appendChild(loadingEl);
    return loadingEl;
}

// Debounce function to limit API calls while typing
function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Initialize search
function initSearch() {
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    // Add event listener with debounce
    searchInput.addEventListener('input', debounce(handleSearch, 500));
    
    // Add clear search on ESC key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            // Import and call fetchPopularMovies if search is cleared
            import('./main.js').then(module => {
                if (module.fetchPopularMovies) {
                    module.fetchPopularMovies();
                }
            }).catch(err => {
                console.error('Could not load main.js:', err);
            });
        }
    });
}

// Handle search input
async function handleSearch() {
    const query = searchInput.value.trim();
    
    // If search is empty, show popular movies
    if (!query) {
        // Import and call fetchPopularMovies from main.js
        import('./main.js').then(module => {
            if (module.fetchPopularMovies) {
                module.fetchPopularMovies();
            }
        }).catch(err => {
            console.error('Could not load main.js:', err);
        });
        return;
    }
    
    // Show loading indicator
    showLoading();
    
    try {
        // Perform search
        await searchMovies(query);
    } catch (error) {
        console.error('Search error:', error);
        showError('Failed to search movies');
    } finally {
        hideLoading();
    }
}

// Search movies API
async function searchMovies(query) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            searchResults = data.results; // Store results for later use
            renderSearchResults(data.results);
        } else {
            // No results found
            if (moviesContainer) {
                moviesContainer.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-search text-5xl text-gray-500 mb-4"></i>
                        <p class="text-white text-xl mb-2">No results found for "${query}"</p>
                        <p class="text-gray-400">Try a different search term</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}

// Render search results
function renderSearchResults(movies) {
    if (!moviesContainer) return;
    
    // Clear container
    moviesContainer.innerHTML = '';
    
    // Add search results heading
    const searchHeading = document.createElement('div');
    searchHeading.className = 'col-span-full mb-4';
    searchHeading.innerHTML = `
        <div class="flex items-center justify-between">
            <h2 class="text-xl text-white font-bold">Search Results (${movies.length})</h2>
            <button id="clear-search" class="text-sm text-gray-400 hover:text-white">
                <i class="fas fa-times mr-1"></i> Clear
            </button>
        </div>
    `;
    moviesContainer.appendChild(searchHeading);
    
    // Add event listener to clear button
    document.getElementById('clear-search').addEventListener('click', () => {
        searchInput.value = '';
        // Try to import fetchPopularMovies from main.js
        import('./main.js').then(module => {
            if (module.fetchPopularMovies) {
                module.fetchPopularMovies();
            }
        }).catch(err => {
            console.error('Could not load main.js:', err);
        });
    });
    
    // Function to get genres by IDs
    function getSimpleGenresByIds(genreIds) {
        if (!genreIds || genreIds.length === 0) return 'Unknown Genre';
        return 'Movie'; // Simplified placeholder when we don't have access to the full genre list
    }
    
    // Render each movie
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105';
        
        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/780x400?text=No+Image+Available';
            
        const overview = movie.overview
            ? (movie.overview.length > 100 ? movie.overview.substring(0, 100) + '...' : movie.overview)
            : 'No description available';
            
        // Use a simple genre handling for now
        const movieGenres = getSimpleGenresByIds(movie.genre_ids);
            
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
                        <i class="fas fa-star mr-1"></i>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </span>
                </div>
                <p class="text-gray-400 text-sm mt-1">${movieGenres}</p>
                <p class="text-gray-300 text-sm mt-2 line-clamp-2">${overview}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-gray-400 text-xs">${movie.release_date || 'Unknown'}</span>
                    <div class="flex space-x-2">
                        <button onclick="addToWatchlist(${movie.id})" class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full">
                            + Watchlist
                        </button>
                        <a href="film_page.html?id=${movie.id}" class="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full flex items-center">
                            <i class="fas fa-play-circle mr-1"></i> Trailer
                        </a>
                    </div>
                </div>
            </div>
        `;
        moviesContainer.appendChild(movieCard);
    });
}

// Add to watchlist from search results
window.addToWatchlist = function(id) {
    const favList = JSON.parse(localStorage.getItem('favList')) || [];
    
    const isElementExists = favList.some(item => item.id === id);
    
    if (!isElementExists) {
        const favElement = searchResults.find(item => item.id === id);
        if (favElement) {
            favList.push(favElement);
            localStorage.setItem('favList', JSON.stringify(favList));
            alert('Added to watchlist!');
        } else {
            alert('Movie not found!');
        }
    } else {
        alert('This movie is already in your watchlist');
    }
};

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initSearch);

// Export functions for potential use in other modules
export { searchMovies, renderSearchResults };