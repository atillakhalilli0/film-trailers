
const watchlistContainer = document.getElementById('watchlistContainer')
        
function getFavFilms() {
    return JSON.parse(localStorage.getItem('favList'))
}

function showFav() {
        favSec.innerHTML = ''
        const favList = getFavFilms()

        favList.forEach(movie => {
            
        watchlistContainer.innerHTML += `
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
            <p class="text-gray-400 text-sm mt-1">${movie.genre_ids ? 'Genres' : 'Unknown Genre'}</p>
            <p class="text-gray-300 text-sm mt-2 line-clamp-2">${overview}</p>
            <div class="flex justify-between items-center mt-4">
                <span class="text-gray-400 text-xs">${movie.release_date || 'Unknown'}</span>
                <button onclick="window.removeFromWatchlist(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')" class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full">
                    Remove
                </button>
            </div>
        </div>
`
        });
}