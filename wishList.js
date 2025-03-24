// Import necessary variables from common.js
import { IMAGE_BASE_URL } from './common.js';

// DOM Elements
const watchlistContainer = document.getElementById('watchlistContainer');

// Get watchlist items from localStorage
function getFavFilms() {
    return JSON.parse(localStorage.getItem('favList')) || [];
}

// Display watchlist items
function showWatchlist() {
    // Check if container exists
    if (!watchlistContainer) {
        console.error('Watchlist container not found');
        return;
    }
    
    // Clear container before adding new content
    watchlistContainer.innerHTML = '';
    
    // Get favorites list
    const favList = getFavFilms();
    
    // Check if list is empty
    if (favList.length === 0) {
        watchlistContainer.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-film text-4xl text-gray-500 mb-3"></i>
                <p class="text-gray-300">Your watchlist is empty</p>
                <a href="https://film-trailers-by-atilla.vercel.app" class="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
                    Browse Movies
                </a>
            </div>
        `;
        return;
    }

    // Loop through favorites and add to container
    favList.forEach(movie => {
        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/780x400?text=No+Image+Available';

        const overview = movie.overview
            ? (movie.overview.length > 100 ? movie.overview.substring(0, 100) + '...' : movie.overview)
            : 'No description available';
            
        const watchlistItem = document.createElement('div');
        watchlistItem.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105';
        watchlistItem.innerHTML = `
            <div class="relative">
                <img class="w-full h-96 object-contain" src="${posterPath}" alt="${movie.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <a href="film_page.html?id=${movie.id}" class="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <i class="fas fa-play"></i>
                </a>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-white">${movie.title}</h3>
                    <span class="text-yellow-500 flex items-center text-sm">
                        <i class="fas fa-star mr-1"></i> ${movie.vote_average || 'N/A'}
                    </span>
                </div>
                <p class="text-gray-400 text-sm mt-1">${getGenreNamesByIds(movie.genre_ids)}</p>
                <p class="text-gray-300 text-sm mt-2 line-clamp-2">${overview}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-gray-400 text-xs">${movie.release_date || 'Unknown'}</span>
                    <button onclick="removeFromWatchlist(${movie.id})" class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full">
                        Remove
                    </button>
                </div>
            </div>
        `;
        watchlistContainer.appendChild(watchlistItem);
    });
}

// Function to get genre names - simplified version as we don't have access to the full genre list on this page
function getGenreNamesByIds(genreIds) {
    if (!genreIds || genreIds.length === 0) return 'Unknown Genre';
    
    // Since we don't have the full genre list here, just show the IDs
    // In a production app, you'd either fetch the genre list here or pass it from another module
    return `Genres: ${genreIds.join(', ')}`;
}

// Remove movie from watchlist
function removeFromWatchlist(id) {
    let favList = getFavFilms();
    
    // Find movie to display name in confirmation
    const movieToRemove = favList.find(item => item.id === id);
    const movieTitle = movieToRemove ? movieToRemove.title : 'this movie';
    
    // Filter out the movie with the specified id
    favList = favList.filter(item => item.id !== id);
    
    // Save updated list back to localStorage
    localStorage.setItem('favList', JSON.stringify(favList));
    
    // Refresh the watchlist display
    showWatchlist();
    
    // Show confirmation
    alert(`"${movieTitle}" has been removed from your watchlist`);
}

// Make functions globally available
window.getFavFilms = getFavFilms;
window.showWatchlist = showWatchlist;
window.removeFromWatchlist = removeFromWatchlist;

// Initialize watchlist display when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (watchlistContainer) {
        showWatchlist();
    }
});