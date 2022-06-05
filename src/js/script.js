// DATA #################
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

// Get Like
function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {};
  }

  return movies;
}

// Set Like
function likeMovie(movie) {
  const likedMovies = likedMoviesList();
  console.log(likedMovies)

  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}

// HELPERS #################
// Lazy Loading
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // console.log(entry.target.setAttribute);
      const url = entry.target.getAttribute('data-src');
      entry.target.setAttribute('src', url);
    }
  });
});
// Create Movie
function createMovies(movies, container, {
  lazyLoad = false,
  clean = true
} = {}) {
  if (clean) {
    container.innerHTML = '';
  }

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');


    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      lazyLoad ? 'data-src' : 'src',
      URL_IMG + movie.poster_path
    );
    movieImg.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute(
        'src',
        'https://static.platzi.com/static/images/error/img404.png'
      );
    });

    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-btn');
    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-btn--liked');
      likeMovie(movie);
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
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

// CALL API #################
// Get Trending Preview
async function getTrendingMoviePreview() {
  const {
    data
  } = await api('trending/movie/day');
  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList, true);
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

  maxPage = data.total_pages;

  createMovies(movies, genericSection, {
    lazyLoad: true,
    clean: true
  });
}
// Trending Pagination
async function getPaginatedTrendingMovies() {
  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15;
  const pageIsNotMax = page >= maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    page++;
    const {
      data
    } = await api('trending/movie/day', {
      params: {
        page,
      },
    });
    const movies = data.results;

    createMovies(movies, genericSection, {
      lazyLoad: true,
      clean: false
    });
  }
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
  maxPage = data.total_pages;
  console.log(maxPage);

  createMovies(movies, genericSection, true);
}
// Search Pagination
function getPaginatedMoviesBySearch(query) {
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const {
        data
      } = await api('search/movie', {
        params: {
          query,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, {
        lazyLoad: true,
        clean: false
      });
    }
  }
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
  maxPage = data.total_pages;

  createMovies(movies, genericSection, {
    lazyLoad: true
  });
}
// Category Pagination
function getPaginatedMoviesByCategory(id) {
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const {
        data
      } = await api('discover/movie', {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, {
        lazyLoad: true,
        clean: false
      });
    }
  }
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
// Get Movie Related by ID
async function getRelatedMoviesId(id) {
  const {
    data
  } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer, true);
}

// CALL LOCALSTORAGE #################
function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesListArticle, {
    lazyLoad: true,
    clean: true
  });

  console.log(likedMovies)
}


// CALL FUNCTIONS #################
getTrendingMoviePreview();
getCategoryMoviePreview();
getLikedMovies();