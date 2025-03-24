// relatedMovies.js - Handles rendering related movies
const relatedMoviesContainer = document.querySelector('.grid');

function renderRelatedMovies(movies) {
    if (!movies || movies.length === 0) {
        relatedMoviesContainer.innerHTML = '<p class="col-span-full text-center">No related movies found</p>';
        return;
    }
    
    relatedMoviesContainer.innerHTML = '';
    
    movies.slice(0, 4).forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105';
        
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image+Available';
        
        movieCard.innerHTML = `
            <a href="film_page.html?id=${movie.id}">
                <div class="relative">
                    <img class="w-full h-64 object-cover" src="${posterPath}" alt="${movie.title}">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-white">${movie.title}</h3>
                    <p class="text-gray-400 text-sm mt-1">${movie.release_date || 'Unknown'}</p>
                </div>
            </a>
        `;
        
        relatedMoviesContainer.appendChild(movieCard);
    });
}