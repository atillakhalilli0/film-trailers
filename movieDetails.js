// movieDetails.js - Handles rendering movie details
const movieDetailsContainer = document.getElementById('movies-container');
const loadingElement = document.getElementById('loading');

// Format movie genres
function formatGenres(genres) {
    return genres ? genres.map(genre => genre.name).join(', ') : 'N/A';
}

// Render movie details
function renderMovieDetails(movie) {
    // Get trailer key
    const trailerKey = getTrailerKey(movie);
    
    // Format genres
    const genres = formatGenres(movie.genres);
    
    // Create details container
    const detailsContainer = document.createElement('div');
    detailsContainer.innerHTML = `
        <h1 class="text-3xl font-bold mb-4">${movie.title}</h1>
        <p class="mb-4">${movie.overview || 'No description available'}</p>
        <p class="mb-2"><strong>Release Date:</strong> ${movie.release_date || 'Unknown'}</p>
        <p class="mb-6"><strong>Genres:</strong> ${genres}</p>
        
        <h3 class="text-2xl font-semibold mb-4">Trailer</h3>
        ${trailerKey ? 
            `<div class="aspect-w-16 aspect-h-9 mb-8">
                <iframe class="w-full h-96" src="https://www.youtube.com/embed/${trailerKey}" 
                    frameborder="0" allowfullscreen></iframe>
            </div>` : 
            `<p class="mb-8">No trailer available.</p>`
        }
        
        <h3 class="text-2xl font-semibold mb-4">Cast</h3>
    `;
    
    movieDetailsContainer.appendChild(detailsContainer);
    
    // Render cast section
    renderCastSection(movie);
}

// Show error message
function showError(message) {
    movieDetailsContainer.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
            <p class="text-xl">${message}</p>
        </div>
    `;
}

// Hide loading indicator
function hideLoading() {
    loadingElement.classList.add('hidden');
}