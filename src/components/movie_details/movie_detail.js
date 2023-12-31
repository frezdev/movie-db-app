import { getRelatedMovies } from '../../services/movies-axios.js';
import { carousel } from '../carousel/carousel.js';
import { Category } from '../category/category.js';
import { LoadingSpinner } from '../loading_spinner/loading_spinner.js';
import { Poster } from '../poster/poster.js';
import styles from './movie_detail.module.css';

const $ = document;

const infoContainer = $.querySelector('#movie-details_info');
infoContainer.className = styles['info-container'];

const movieTitle = $.createElement('h2');
movieTitle.className = styles['movie-title'];

const info = $.createElement('div');
info.className = styles.info;

const voteAverage = $.createElement('span');
voteAverage.className = styles['vote-average'];

const overviewText = $.createElement('p');
overviewText.className = styles['overview-text'];

const categoriesContainer = $.createElement('section');
categoriesContainer.className = styles['categories-container'];

const relatedMoviesContainer = $.querySelector('#related-movies-container');
relatedMoviesContainer.className = styles['related-movies-container'];

const relatedMovies = $.querySelector('#related-movies');
relatedMovies.className = styles['related-movies'];

const overviewAndCategoriesContainer = $.createElement('div');
overviewAndCategoriesContainer.className = styles['overview-and-categories-container'];

overviewAndCategoriesContainer.append(
  overviewText,
  categoriesContainer
);

info.append(
  voteAverage,
  overviewAndCategoriesContainer
);

infoContainer.append(
  movieTitle,
  info
);

export function movieInfo ({ title, overview, vote_average, genres, id }) {
  relatedMoviesContainer.classList.add('inactive');
  movieTitle.textContent = title;

  const average = Number(vote_average);
  voteAverage.textContent = `${average.toFixed(1)} / 10`;

  overviewText.textContent = overview;

  categoriesContainer.textContent = '';
  genres?.forEach(genre => categoriesContainer.appendChild(Category(genre)));

  // const page = 1;
  const target = document.createElement('div');
  target.className = styles.target;

  relatedMovies.innerHTML = '';
  const carouselContainer = carousel();
  relatedMovies.append(carouselContainer);

  let page = 1;
  let movies = [];

  const spinner = LoadingSpinner();

  const io = createIntersectionObserver(async () => {
    const moviesData = await getRelatedMovies({ movieId: id, page: page++ });
    if (moviesData.length > 0) {
      movies = [...movies, ...moviesData];
      relatedMoviesContainer.classList.remove('inactive');

      moviesData?.forEach(movie => {
        if (movie.id !== movies.at(-1).id || movies.length === 1) {
          carouselContainer.appendChild(
            Poster({ movie })
          );
        }
      });
      carouselContainer.appendChild(target);
    }
    if (moviesData.length === 0) {
      io.disconnect();
      target.removeChild(spinner);
    }
  });
  target.appendChild(spinner);
  io.observe(target);
}

export function createIntersectionObserver (callback) {
  const io = new window.IntersectionObserver(
    () => callback()
  );

  return io;
}
