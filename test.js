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

// Initialize page based on URL
    const carousel = document.getElementById('carousel');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const trailerModal = document.getElementById('trailerModal');
      const trailerIframe = document.getElementById('trailerIframe');
      const closeModal = document.getElementById('closeModal');
      
      // Fetch trending movies
      async function fetchMovies() {
        try {
          // Clear loading placeholder
          carousel.innerHTML = '';
          
          const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
          const data = await response.json();
          
          // Populate carousel with movies
          data.results.slice(0, 10).forEach(movie => {
            createMovieCard(movie);
          });
        } catch (error) {
          console.error('Error fetching movies:', error);
          carousel.innerHTML = `<div class="text-center w-full py-4">Error loading movies. Please try again later.</div>`;
        }
      }
      
      // Create movie card element
      function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.className = 'flex-none w-80 md:w-96 snap-start';
        movieCard.innerHTML = `
          <div class="relative group" data-movie-id="${movie.id}">
            <div class="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
              <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}" 
                   alt="${movie.title}" 
                   class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button class="play-trailer bg-red-600/90 hover:bg-red-600 text-white p-4 rounded-full transition-colors">
                  <i class="fas fa-play"></i>
                </button>
              </div>
            </div>
            <div class="mt-2">
              <h3 class="font-bold text-white">${movie.title}</h3>
              <div class="flex items-center text-gray-400 text-sm">
                <span class="flex items-center mr-2">
                  <i class="fas fa-star text-yellow-500 mr-1 text-xs"></i>
                  ${movie.vote_average.toFixed(1)}
                </span>
                <span>${new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
          </div>
        `;
        
        // Add event listener to play trailer button
        const playButton = movieCard.querySelector('.play-trailer');
        playButton.addEventListener('click', () => {
          fetchAndPlayTrailer(movie.id);
        });
        
        carousel.appendChild(movieCard);
      }
      
      // Fetch and play trailer
      async function fetchAndPlayTrailer(movieId) {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
          const data = await response.json();
          
          // Find trailer in results
          const trailer = data.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          ) || data.results[0]; // Fallback to first video if no trailer
          
          if (trailer && trailer.site === 'YouTube') {
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&fs=1`;
            trailerModal.classList.remove('hidden');
          } else {
            alert('No trailer available for this movie');
          }
        } catch (error) {
          console.error('Error fetching trailer:', error);
          alert('Error loading trailer. Please try again later.');
        }
      }
      
      // Close modal
      closeModal.addEventListener('click', () => {
        trailerModal.classList.add('hidden');
        trailerIframe.src = '';
      });
      
      // Click outside to close
      trailerModal.addEventListener('click', (e) => {
        if (e.target === trailerModal) {
          trailerModal.classList.add('hidden');
          trailerIframe.src = '';
        }
      });
      
      // Carousel navigation
      let scrollAmount = 0;
      const cardWidth = 384; // Approximate width of a card with margin (w-96 + margin)
      
      prevBtn.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - cardWidth, 0);
        carousel.scrollTo({
          left: scrollAmount,
          behavior: 'smooth'
        });
      });
      
      nextBtn.addEventListener('click', () => {
        scrollAmount = Math.min(scrollAmount + cardWidth, carousel.scrollWidth - carousel.clientWidth);
        carousel.scrollTo({
          left: scrollAmount,
          behavior: 'smooth'
        });
      });
      
      // Initialize
      fetchMovies();

    if (currentPage === 'test.html') {
        fetchPopularMovies();
    } else if (currentPage === 'genres.html') {
        fetchGenres();
    } else if (currentPage === 'genre_movies.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const genreId = urlParams.get('id');
        if (genreId) {
            fetchMoviesByGenre(genreId);
        }
    } else if (currentPage === 'film_page.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        if (movieId) {
            fetchMovieDetails(movieId);
        }
    }


// Fetch popular movies for homepage
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            renderMovies(data.results);
        } else {
            showError('No movies found');
        }
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        showError('Failed to load movies');
    } finally {
        hideLoading();
    }
}

// Fetch genres
async function fetchGenres() {
    try {
        const response = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        
        if (data.genres && data.genres.length > 0) {
            renderGenres(data.genres);
        } else {
            showError('No genres found');
        }
    } catch (error) {
        console.error('Error fetching genres:', error);
        showError('Failed to load genres');
    } finally {
        hideLoading();
    }
}

// Fetch movies by genre
async function fetchMoviesByGenre(genreId) {
    try {
        const response = await fetch(`${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            renderMovies(data.results);
        } else {
            showError('No movies found for this genre');
        }
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        showError('Failed to load movies');
    } finally {
        hideLoading();
    }
}

// Fetch movie details
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits`);
        const movie = await response.json();
        
        if (movie) {
            renderMovieDetails(movie);
        } else {
            showError('Movie details not available');
        }
    } catch (error) {
        console.error('Error fetching movie details for ID ' + movieId + ':', error);
        showError('Failed to load movie details: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Render movies list
function renderMovies(movies) {
    moviesContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105';
        
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : 'https://via.placeholder.com/780x400?text=No+Image+Available';
        
        const overview = movie.overview ? 
            (movie.overview.length > 100 ? movie.overview.substring(0, 100) + '...' : movie.overview) : 
            'No description available';
        
        // Generate a random rating for demo purposes (would use actual rating in production)
        const rating = (Math.random() * 2 + 7).toFixed(1);
        
        movieCard.innerHTML = `
            <div class="relative">
                <img class="w-full h-96 object-contain" src="${posterPath}" alt="${movie.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                ${movie.release_date && new Date(movie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 
                    '<div class="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</div>' : ''}
                <button class="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-white">${movie.title}</h3>
                    <span class="text-yellow-500 flex items-center text-sm">
                        <i class="fas fa-star mr-1"></i>${rating}
                    </span>
                </div>
                <p class="text-gray-400 text-sm mt-1">${movie.genre_ids ? 'Action, Drama' : 'Unknown Genre'}</p>
                <p class="text-gray-300 text-sm mt-2 line-clamp-2">${overview}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-gray-400 text-xs">${movie.release_date || 'Unknown'}</span>
                    <div class="flex space-x-2">
                        <button class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full">
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

// Render genres
function renderGenres(genres) {
    moviesContainer.innerHTML = '<h1 class="text-3xl font-bold mb-6 col-span-full">Genres</h1>';
    
    genres.forEach(genre => {
        const genreCard = document.createElement('div');
        genreCard.className = 'bg-cardBg rounded-lg overflow-hidden shadow-lg';
        
        genreCard.innerHTML = `
            <div class="p-4">
                <h5 class="text-xl font-semibold mb-4">${genre.name}</h5>
                <a href="genre_movies.html?id=${genre.id}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                    <i class="fas fa-film mr-1"></i> View Movies
                </a>
            </div>
        `;
        
        moviesContainer.appendChild(genreCard);
    });
}

// Render movie details
function renderMovieDetails(movie) {
    // Find a trailer if available
    let trailerKey = '';
    if (movie.videos && movie.videos.results) {
        const trailer = movie.videos.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube');
        if (trailer) {
            trailerKey = trailer.key;
        }
    }
    
    // Format genres
    const genres = movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A';
    
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
    
    moviesContainer.appendChild(detailsContainer);
    
    // Create cast section
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
        
        moviesContainer.appendChild(castContainer);
    } else {
        const noCastMessage = document.createElement('p');
        noCastMessage.textContent = 'No cast information available.';
        moviesContainer.appendChild(noCastMessage);
    }
}

// Hide loading indicator
function hideLoading() {
    loadingElement.classList.add('hidden');
}

// Show error message
function showError(message) {
    moviesContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
            <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
            <p class="text-xl">${message}</p>
        </div>
    `;
}

