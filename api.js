// api.js - Handles API requests and data fetching
const API_KEY = 'd8972914c7508d0355cce580a7e5910d';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780';

// Movie details API request
function fetchMovieDetails(movieId) {
    return fetch(`${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

// Related movies API request
function fetchRelatedMovies(movieId) {
    return fetch(`${API_BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

// Get movie trailer key
function getTrailerKey(movie) {
    if (movie.videos && movie.videos.results) {
        const trailer = movie.videos.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube');
        return trailer ? trailer.key : null;
    }
    return null;
}