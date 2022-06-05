// DATA
let page = 1;
let infiniteScroll;
let maxPage;

// EVENTS
window.addEventListener('DOMContentLoader', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

searchFormBtn.addEventListener('click', () => {
  location.hash = '#search=' + searchFormInput.value;
});
trendingBtn.addEventListener('click', () => {
  location.hash = '#trend'
});
arrowBtn.addEventListener('click', () => {
  history.back();
});

// FUNCIONS
function navigator() {
  console.log({
    location
  });

  if (infiniteScroll) {
    window.removeEventListener('scroll', infiniteScroll, {
      passive: false
    });
    infiniteScroll = undefined;
  }

  if (location.hash.startsWith('#trend')) {
    trendPage();
  } else if (location.hash.startsWith('#search')) {
    searchPage();
  } else if (location.hash.startsWith('#movie')) {
    movieDetaildPage();
  } else if (location.hash.startsWith('#category')) {
    categoryPage();
  } else {
    homePage();
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (infiniteScroll) {
    window.addEventListener('scroll', infiniteScroll, {
      passive: false
    });
  }
}

function homePage() {
  console.log('Home!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  likedMoviesSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');

  getTrendingMoviePreview();
  getCategoryMoviePreview();
  getLikedMovies();
}

function trendPage() {
  console.log('Trend!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerHTML = 'Tends';

  getTrendingMovie();
  infiniteScroll = getPaginatedTrendingMovies;
}

function categoryPage() {
  console.log('Category!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  // ['#category', 'id-name']
  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');
  headerCategoryTitle.innerHTML = categoryName;

  getMovieByCategory(categoryId);

  infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function movieDetaildPage() {
  console.log('Movie!');

  headerSection.classList.add('header-container--long');
  // headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');

  // ['#movie', 'id']
  const [_, id] = location.hash.split('=');
  getMovieById(id);
}

function searchPage() {
  console.log('Search!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  // ['#search', 'seeker']
  const [_, query] = location.hash.split('=');
  getMovieBySearch(query);

  infiniteScroll = getPaginatedMoviesBySearch(query);
}