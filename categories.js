// categories.js - A module to handle movie categories/genres

import { API_KEY, API_BASE_URL, hideLoading, showError } from './common.js';

// DOM Elements
const categoriesContainer = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4.gap-4');
const categoriesSection = document.querySelector('section.mb-12');

// Map of genre names to appropriate Font Awesome icons
const genreIconMap = {
    'Action': 'fa-explosion',
    'Adventure': 'fa-compass',
    'Animation': 'fa-child',
    'Comedy': 'fa-face-laugh',
    'Crime': 'fa-handcuffs',
    'Documentary': 'fa-video',
    'Drama': 'fa-masks-theater',
    'Family': 'fa-users',
    'Fantasy': 'fa-dragon',
    'History': 'fa-landmark',
    'Horror': 'fa-ghost',
    'Music': 'fa-music',
    'Mystery': 'fa-question',
    'Romance': 'fa-heart',
    'Science Fiction': 'fa-rocket',
    'TV Movie': 'fa-tv',
    'Thriller': 'fa-person-running',
    'War': 'fa-gun',
    'Western': 'fa-hat-cowboy'
};

// Get appropriate icon for a genre
function getIconForGenre(genreName) {
    return genreIconMap[genreName] || 'fa-film'; // Default to film icon if no mapping exists
}

// Fetch and display popular categories/genres
export async function initializeCategories() {
    try {
        // Show loading state if needed
        if (typeof showLoading === 'function') {
            showLoading('Loading categories...');
        }
        
        const response = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        
        if (data.genres && data.genres.length > 0) {
            renderCategories(data.genres.slice(0, 4)); // Only show first 4 genres
        } else {
            showError('No genres found');
        }
    } catch (error) {
        console.error('Error fetching genres:', error);
        showError('Failed to load categories');
    } finally {
        hideLoading();
    }
}

// Count movies per genre
export async function getMovieCountByGenre(genreId) {
    try {
        const response = await fetch(`${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
        const data = await response.json();
        return data.total_results || 0;
    } catch (error) {
        console.error(`Error fetching movie count for genre ${genreId}:`, error);
        return 0;
    }
}

// Render categories in the UI
async function renderCategories(genres) {
    if (!categoriesContainer) return;
    
    // Clear previous content
    categoriesContainer.innerHTML = '';
    
    // Update the heading if needed
    const heading = categoriesSection.querySelector('h2');
    if (heading) {
        heading.innerHTML = 'Popular <span class="text-red-600">Categories</span>';
    }
    
    // Render each genre
    for (const genre of genres) {
        // Get movie count for this genre
        const movieCount = await getMovieCountByGenre(genre.id);
        
        // Get appropriate icon
        const iconClass = getIconForGenre(genre.name);
        
        const categoryCard = document.createElement('a');
        categoryCard.href = `genre_movies.html?id=${genre.id}&name=${encodeURIComponent(genre.name)}`;
        categoryCard.className = 'relative rounded-lg overflow-hidden group';
        
        categoryCard.innerHTML = `
            <div class="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center transition-transform duration-500">
                <i class="fas ${iconClass} text-red-600 text-6xl"></i>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-4">
                <h3 class="font-bold text-white">${genre.name}</h3>
                <p class="text-gray-300 text-sm">${movieCount} Movies</p>
            </div>
        `;
        
        categoriesContainer.appendChild(categoryCard);
    }
}

// Export functions
export { renderCategories };