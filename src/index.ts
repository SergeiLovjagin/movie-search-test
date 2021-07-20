import './styles.scss';
import Movies from './Movies';

// Initialises Movies API
const movies: Movies = new Movies();

// Remember references to the DOM elements used later
const resultsContainer = document.getElementById('search-results');
resultsContainer.className = 'search-results'
const detailsContainer = document.getElementById('movie-details');

const errorContainer = document.getElementById('error');

// Add listener to search button
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const searchByYear = document.getElementById('search-input-year');
searchButton.addEventListener('click', () => {
    updateSearchResults((searchInput as HTMLInputElement).value, (searchByYear as HTMLInputElement).value);
});

searchInput.addEventListener('input', (e) => {
    setTimeout(() => {
        const keyword = (e.target as HTMLInputElement).value
        if (keyword.length >= 3) {
            return updateSearchResults(keyword, (searchByYear as HTMLInputElement).value)
        }
    }, 300)
})

// Display error message to user
const displayError = (message: string) => {
    errorContainer.innerHTML = `<div>Error: ${message}</div>`;
};

// Load new search results and update the listing
const updateSearchResults = async (keyword: string, year: string = '') => {
    let results = []
    document.getElementById('search-results').innerHTML = ''
    try {
        results = await movies.search(keyword, year);
        document.getElementById('error').innerHTML = ''
    } catch (error) {
        displayError(error);
    }
    // Add movie results one-by-one to the list

    results.slice(0, 10).sort((a, b) => a.Title < b.Title ? -1 : 1).forEach((movie) => {
        const movieContainer: HTMLElement = document.createElement('button');
        movieContainer.className = 'movie'
        movieContainer.innerHTML = movie.Title;
        movieContainer.addEventListener('click', updateMovieDetails.bind(this, movie.imdbID));
        resultsContainer.appendChild(movieContainer);
    });
};

// Load detailed information about a movie by its IMDB ID

const updateMovieDetails = async (movieId: string) => {
    let result = {
        title: '',
        plot: '',
        uniqueWords: 0
    }
    try {
        result = await movies.movieDetails(movieId);
    } catch (error) {
        displayError(error)
    }
    detailsContainer.innerHTML = `<section>Movie Title: ${result.title}
                                       
                                       Unique words: ${result.uniqueWords}
                                       
                                       Movie plot: ${result.plot}
                                  </section>`;
    // Make an API request and return movie information.
    // E.g: http://www.omdbapi.com/?i=tt0465494&apikey=86e1fde4
};