import axios from 'axios';
import {api} from './Config';
import {info} from './Log';

const moviesAjax = axios.create({
    baseURL: api.baseUrl
});

export default class Movies {

    alreadySearched = {}

    constructor() {
        info('Initialise Movies API.');
    }

    // Search for a movie from API by its title.
    async search(title = '', year?) {

        let exist: boolean = Object.keys(this.alreadySearched).some(el => el === (title + ' ' + year))
        if (exist) {
            return this.alreadySearched[title + ' ' + year]
        } else {

            info(`Search for "${title}" from Movies API.`);

            let searchQuery = `?apikey=${api.key}&s=${title}`;

            if (year) {
                info(`Search for movies only from year ${year}.`);
                searchQuery += `&y=${year}`;
            }

            const {data} = await moviesAjax.get(searchQuery);

            if (data.Error) {
                throw data.Error;
            }
            this.alreadySearched[`${title} ${year}`] = data.Search
            return data.Search;
        }
    }

    async movieDetails(movieId: string) {
        let searchQuery = `?apikey=${api.key}&i=${movieId}`;
        const {data} = await moviesAjax.get(searchQuery);
        if (data.Error) {
            throw data.Error;
        }

        const uniqueWords = data.Plot.replace(/[.,\s]/g, ' ')
            .split(' ')
            .filter(Boolean)
            .map(el => el.toLowerCase())
            .filter((el, i, arr) => arr.indexOf(el) === arr.lastIndexOf(el))
            .length

        return {
            title: data.Title,
            plot: data.Plot,
            uniqueWords: uniqueWords
        }
    }
}