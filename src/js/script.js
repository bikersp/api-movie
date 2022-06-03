const URL_TRENDING = 'https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY;
const URL_IMG = 'https://image.tmdb.org/t/p/w300';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
  },
});

// HELPERS
// Create Movie
function createMovies(movies, container) {
  container.innerHTML = '';

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    movieContainer.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src', URL_IMG + movie.poster_path);

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}
// Create Category
function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// CALL API
// Get Trending Preview
async function getTrendingMoviePreview() {
  const {
    data
  } = await api('trending/movie/day');
  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList);
}

// Get Category
async function getCategoryMoviePreview() {
  const {
    data
  } = await api('genre/movie/list');
  const categories = data.genres;

  // categoriesPreviewList.innerHTML = "";
  createCategories(categories, categoriesPreviewList);
}

// Get Trending
async function getTrendingMovie() {
  const {
    data
  } = await api('trending/movie/day');
  const movies = data.results;

  createMovies(movies, genericSection);
}

// Get Movie by Category
async function getMovieByCategory(id) {
  const {
    data
  } = await api('discover/movie', {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

// Get Movie by Search
async function getMovieBySearch(query) {
  const {
    data
  } = await api('search/movie', {
    params: {
      query,
    },
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

// Get Movie by ID
async function getMovieById(id) {
  const {
    data: movie
  } = await api('movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  headerSection.style.background = `
  linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
  url(${movieImgUrl})
  `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesId(id);
}

// Get Movie Related
async function getRelatedMoviesId(id) {
  const {
    data
  } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}

getTrendingMoviePreview();
getCategoryMoviePreview();