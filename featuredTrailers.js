import { API_KEY, showError } from './common.js';

// DOM Elements
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const trailerModal = document.getElementById('trailerModal');
const trailerIframe = document.getElementById('trailerIframe');
const closeModal = document.getElementById('closeModal');

// Fetch trending movies for carousel
async function fetchMovies() {
  try {
    // Clear loading placeholder
    if (carousel) {
      carousel.innerHTML = '';
      
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
      const data = await response.json();
      
      // Populate carousel with movies
      data.results.slice(0, 10).forEach(movie => {
        createMovieCard(movie);
      });
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    if (carousel) {
      carousel.innerHTML = `<div class="text-center w-full py-4">Error loading movies. Please try again later.</div>`;
    }
  }
}

// Create movie card element for carousel
function createMovieCard(movie) {
  if (!carousel) return;
  
  const movieCard = document.createElement('div');
  movieCard.className = 'flex-none w-80 md:w-96 snap-start';
  movieCard.innerHTML = `
    <div class="relative group" data-movie-id="${movie.id}">
      <div class="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
        <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}" 
             alt="${movie.title}" 
             class="w-full h-full object-cover">
        <div class="absolute inset-0"></div>
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
  if (!trailerModal || !trailerIframe) return;
  
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

// Initialize carousel controls
function initializeCarousel() {
  if (!carousel || !prevBtn || !nextBtn || !closeModal || !trailerModal) return;
  
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
}

// Initialize featured trailers
function initializeFeaturedTrailers() {
  initializeCarousel();
  fetchMovies();
}

// Export functions
export { initializeFeaturedTrailers };