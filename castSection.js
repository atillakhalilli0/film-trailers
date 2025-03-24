// castSection.js - Handles rendering cast information
function renderCastSection(movie) {
    if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
        const castContainer = document.createElement('div');
        castContainer.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
        
        movie.credits.cast.slice(0, 8).forEach(cast => {
            const castCard = document.createElement('div');
            castCard.className = 'bg-cardBg rounded-lg overflow-hidden shadow-lg';
            
            const profilePath = cast.profile_path 
                ? `https://image.tmdb.org/t/p/w185${cast.profile_path}` 
                : 'https://via.placeholder.com/185x278?text=No+Image';
            
            castCard.innerHTML = `
                <img class="w-full h-64 object-cover" src="${profilePath}" alt="${cast.name}">
                <div class="p-4">
                    <h5 class="text-lg font-semibold">${cast.name}</h5>
                    <p class="text-gray-400"><strong>Character:</strong> ${cast.character || 'Unknown'}</p>
                </div>
            `;
            
            castContainer.appendChild(castCard);
        });
        
        movieDetailsContainer.appendChild(castContainer);
    } else {
        const noCastMessage = document.createElement('p');
        noCastMessage.textContent = 'No cast information available.';
        movieDetailsContainer.appendChild(noCastMessage);
    }
}